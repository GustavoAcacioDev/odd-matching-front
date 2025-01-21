export function getWinPercentage(pinnacleOdds: number) {
    const x = (pinnacleOdds * 100) * 100
    const y = (100 / x) * 100

    return y
}

export function getKellyValue(betbyOdds: number, winPercentage: number, balance: number){
    let stakeFraction = (betbyOdds * winPercentage - 1) / (betbyOdds - 1)
    stakeFraction = Math.max(0, stakeFraction)
    return stakeFraction * 0.5 * balance
}