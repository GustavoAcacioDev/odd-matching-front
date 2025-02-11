import { NextResponse } from "next/server";
import { chromium } from "playwright";
import { MongoClient } from "mongodb";

// Environment Variables
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "bet_app_db";
const COLLECTION_NAME = "betby_odds";

interface ScrapedData {
  League: string;
  DateTime: string | null;
  "Team 1": string;
  "Team 2": string;
  "Odd Team 1": string | null;
  "Odd Draw": string | null;
  "Odd Team 2": string | null;
  Link?: string | null;
}

function parseRawText(rawText: string): ScrapedData | null {
  const lines = rawText.split("\n").map((line) => line.trim()).filter((line) => line);
  if (lines.length < 6) return null;

  const League = `${lines[0]} - ${lines[1]}`;
  const rawDateTime = lines[2].includes(",") ? lines[2] : null;
  const team1 = lines[3];
  const team2 = lines[4];

  let DateTime: string | null = rawDateTime;
  if (rawDateTime) {
    const parts = rawDateTime.split(",");
    if (parts.length === 2) {
      const dayIndicator = parts[0].trim().toLowerCase();
      const timeStr = parts[1].trim();
      const todayDate = new Date();
      let eventDate = todayDate;

      if (dayIndicator === "today") {
        eventDate = todayDate;
      } else if (dayIndicator === "tomorrow") {
        eventDate.setDate(todayDate.getDate() + 1);
      }

      try {
        const [hours, minutes] = timeStr.split(":").map(Number);
        eventDate.setHours(hours, minutes, 0);
        DateTime = eventDate.toISOString();
      } catch (error) {
        DateTime = null;
      }
    }
  }

  let oddTeam1: string | null, oddDraw: string | null, oddTeam2: string | null;
  try {
    const i1x2 = lines.indexOf("1x2");
    oddTeam1 = lines[i1x2 + 2] || null;
    oddDraw = lines[i1x2 + 4] || null;
    oddTeam2 = lines[i1x2 + 6] || null;
  } catch (error) {
    oddTeam1 = oddDraw = oddTeam2 = null;
  }

  return {
    League,
    DateTime,
    "Team 1": team1,
    "Team 2": team2,
    "Odd Team 1": oddTeam1,
    "Odd Draw": oddDraw,
    "Odd Team 2": oddTeam2,
  };
}

export async function GET() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  try {
    await page.goto(
      "https://demo.betby.com/sportsbook/tile/event-builder?selectedSports=soccer-1&selectedRange=1",
      { waitUntil: "domcontentloaded" }
    );

    await page.waitForTimeout(5000);
    await page.waitForSelector("#bt-inner-page");

    const shadowHost = await page.$("#bt-inner-page");
    const shadowRoot = await shadowHost?.evaluateHandle((node) => node.shadowRoot);

    if (!shadowRoot) {
      console.error("Error: Shadow root not found");
      return NextResponse.json({ error: "Failed to locate shadow root" }, { status: 500 });
    }

    const btRootHandle = await shadowRoot.evaluateHandle((root) => root?.querySelector("#bt-root"));

    if (!btRootHandle) {
      console.error("Error: #bt-root not found");
      return NextResponse.json({ error: "Failed to locate #bt-root" }, { status: 500 });
    }

    const btRoot = btRootHandle.asElement();

    await page.waitForSelector("button");
    const dismissButton = await page.$("button");
    if (dismissButton) await dismissButton.click();

    await btRoot?.waitForSelector('[data-editor-id="eventCardPaginator"]');

    const paginator = await btRoot?.$('[data-editor-id="eventCardPaginator"]');
    const itemsText = await paginator?.$$eval("span", (spans) => spans.map((span) => span.innerText));
    const totalBets = itemsText ? parseInt(itemsText[1].split(" ").pop() || "0", 10) : 0;
    const lastPage = Math.ceil(totalBets / 24);

    const nextButton = (await btRoot?.$$('[data-editor-id="eventCardPaginatorArrow"]'))?.[1];

    if (!nextButton) {
      console.error("Error: 'Next' button not found");
      return NextResponse.json({ error: "'Next' button not found" }, { status: 500 });
    }

    const scrapedData: ScrapedData[] = [];

    for (let currentPage = 1; currentPage <= lastPage; currentPage++) {
      await btRoot?.waitForSelector('[data-editor-id="eventCard"]');
      const eventCards = await btRoot?.$$('[data-editor-id="eventCard"]') ?? [];

      for (const card of eventCards) {
        const linkElement = await card.$('[data-editor-id="eventCardContent"]');
        const href = linkElement ? await linkElement.getAttribute("href") : null;
        const fullText = await card.innerText();

        const parsed = parseRawText(fullText);
        if (parsed) {
          parsed.Link = href;
          scrapedData.push(parsed);
        }
      }

      if (currentPage < lastPage) {
        await nextButton.click();
        await btRoot?.waitForSelector('[data-editor-id="eventCard"]:nth-child(1)', { state: "attached" });
      }
    }

    await browser.close();

    // ================================
    // DATABASE INSERTION
    // ================================
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.deleteMany({});
    if (scrapedData.length > 0) {
      await collection.insertMany(scrapedData);
      return NextResponse.json({ message: `${scrapedData.length} records inserted`, data: scrapedData });
    } else {
      return NextResponse.json({ message: "No data found", data: [] });
    }

    await client.close();
  } catch (error: any) {
    console.error("Scraping error:", error);
    return NextResponse.json({ error: "Scraping failed", details: error.message }, { status: 500 });
  } finally {
    await browser.close();
  }
}
