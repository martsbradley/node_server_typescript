import assert  from 'assert';

export class PageResult<T> {
  readonly data: T[];
  readonly total: number
  constructor(data: T[], total: number) {
    this.data = data;
    this.total = total;
  }
}

function integerPart(value: number): number {
  return Math.round(Number(value));
}


export default class PageInfo {

  page: number; 
  pageSize: number;
  nameFilter: string;
  _dataSize: number;

  constructor(page: number, pageSize: number, nameFilter: string) {

    page = integerPart(page);
    pageSize = integerPart(pageSize);

    if (!page || page < 0) {
      console.log(`page invalid as ${page}`);
      page = 1;
    }

    if (!pageSize || pageSize < 0 || pageSize > 20) {
      console.log(`pageSize invalid as ${pageSize}`);
      pageSize = 5;
    }

    this.page = page;
    this.pageSize = pageSize;
    this.nameFilter= nameFilter;

    //console.log(`page is ${page} pageSize is ${pageSize}`);
  }

  /** limit for the SQL expression */
  get limit(): number {
    return this.pageSize;
  }

  /** Offset for the SQL expression */
  get offset(): number {
    return this.pageSize * (this.page -1);
  }

  set dataSize(dataSize: number) {
    this._dataSize = integerPart(dataSize);
  }
  get dataSize(): number { return this._dataSize;}

  get navFirstPage(): number {return 1;}

  get navLastPage(): number {
    
    if (this._dataSize < 1) 
      return 1;
    else 
      return Math.ceil(this._dataSize/this.pageSize);
  }

  get navPages(): number[] { 
    let result: number[] = [];


    result.push(this.page);
    result.push(this.page-1);
    result.push(this.page-2);
    result.push(this.page-3);
    result.push(this.page-4);
    result.push(this.page-5);
    result.push(this.page+1);
    result.push(this.page+2);
    result.push(this.page+3);
    result.push(this.page+4);
    result.push(this.page+5);

    result = result.filter(n => n > this.navFirstPage);
    result = result.filter(n => n < this.navLastPage);
    const numberSort = (a: number ,b: number): number => {return a - b;};

    const dist =  new Set(result);
    result = [... dist];
    result = result.sort(numberSort);

    // limit th result to be 5 items by
    // removing the items that are furthest from this.page.
    console.log(`Remove unneeded pages from ${result}`);

    while (result.length > 5) {
      const x = result.map(x => Math.abs(x - this.page))
      const maxValue = Math.max(...x);

      let index = x.indexOf(maxValue);
      result.splice(index, 1);     

      if (result.length <=5) break;

      index = x.lastIndexOf(maxValue);
      result.splice(index, 1);     
    }

    return result;
  }
}