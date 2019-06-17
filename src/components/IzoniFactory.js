export default class IzoniFactory {
    constructor(posters, criteria) {
        this.posters = posters
        this.sortByDate = this.sortByDateAndOther() 
        this.pages = this.paging(this.sortByDate)
    }
    onlyTags(tagsArr) {
        const pagesAfterFilter = []
        for (let page of this.pages) {
            const date = page[0].date
            // if (date !== '66-66-66') {
                page = page.filter(i => tagsArr.includes(i.tag))
            // }
            page = page.sort(this.sortIndex)
            page = page.sort(this.sortRaw)
            if (page.length !== 0) {
                pagesAfterFilter.push(page)
            }
        }
        return pagesAfterFilter
    }
    paging(posters) {
        const newPages = []
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
        return newPages;
    }
    strSum(str) {
        const strarr = str.split('')
        let i = 0
        strarr.forEach((a) => {
            i = i + a.charCodeAt(0)
        })
        return i;
    }
    sortByDateAndOther() {
        return this.posters.sort((a ,b)=>{
            const Adate = parseInt(a.date.split('-').join(''), 10) * 1000
            const Bdate = parseInt(b.date.split('-').join(''), 10) * 1000
            const Astr = this.strSum(a.name) / 1000
            const Bstr = this.strSum(b.name) / 1000
            const AScore = Adate + Astr + a.ep + a.part
            const BScore = Bdate + Bstr + b.ep + b.part
            return BScore - AScore;
        })
    }
    sortIndex(a, b) {
        return b.index - a.index
    }
    sortRaw(a, b) {
        return a.isRaw - b.isRaw
    }

}