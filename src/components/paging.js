function strSum(str) {
    const strarr = str.split('')
    let i = 0
    strarr.forEach((a) => {
        i = i + a.charCodeAt(0)
    })
    return i;
}

function sortIndex(a, b) {
    return b.index - a.index
}

function sortRaw(a, b) {
    return a.isRaw - b.isRaw
}

function sortScore(a, b) {
    const Astr = strSum(a.name) / 1000
    const Bstr = strSum(b.name) / 1000
    const AScore = Astr + a.ep + a.part
    const BScore = Bstr + b.ep + b.part
    return BScore - AScore;
}

export default function paging(posters) {
    let newPages = []
    let i = -1;
    let lastDate = ''
    posters.map((poster) => {
        if (lastDate === poster.date) {
            newPages[i].push(poster)
        } else {
            i++
            lastDate = poster.date
            newPages[i] = [poster]
        }
    })
    newPages = newPages.map(page => {
        page = page.sort(sortScore)
        page = page.sort(sortIndex)
        page = page.sort(sortRaw)
        return page
    })
    return newPages;
}
