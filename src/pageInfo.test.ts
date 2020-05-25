import PageInfo from './pageInfo';

describe('PageInfo', () => {

  it('checking properties', () => {
      let pageInfo = new PageInfo(1, 5, '');

      expect(pageInfo.page).toEqual(1);
      expect(pageInfo.limit).toEqual(5);

      pageInfo = new PageInfo(2, 5, '');
      pageInfo.dataSize = 10;

      expect(pageInfo.page).toEqual(2);
      expect(pageInfo.limit).toEqual(5);
      expect(pageInfo.dataSize).toEqual(10);
  });

  it('page1', () => {
      const pageInfo = new PageInfo(1, 5, '');
      pageInfo.dataSize = 10;

      expect(pageInfo.offset).toEqual(0);
      expect(pageInfo.navFirstPage).toEqual(1);
      expect(pageInfo.navLastPage).toEqual(2);
  });

  it('page2', () => {
      const pageInfo = new PageInfo(2, 5, '');
      pageInfo.dataSize = 11;

      expect(pageInfo.offset).toEqual(5);
      expect(pageInfo.navLastPage).toEqual(3);
  });
  it('6 pages', () => {
      const pageInfo = new PageInfo(10, 5, '');
      pageInfo.dataSize = 100;

      expect(pageInfo.offset).toEqual(45);
      expect(pageInfo.navLastPage).toEqual(20);
      const result = pageInfo.navPages;
      //console.log(`result is ${result}`);
      //expect(result).toEqual([2,3,4])

  });

  it('page invalid', () => {
      const pageInfo = new PageInfo(0, 0, '');

      expect(pageInfo.page).toEqual(1);
      expect(pageInfo.limit).toEqual(5);
      expect(pageInfo.offset).toEqual(0);
  });

  it('20 results', () => {
      const pageInfo = new PageInfo(1, 5, '');
      pageInfo.dataSize = 20;
      expect(pageInfo.navFirstPage).toEqual(1);
      expect(pageInfo.navLastPage).toEqual(4);
  });

  it('no results', () => {
      const pageInfo = new PageInfo(1, 5, '');
      pageInfo.dataSize = 0;
      expect(pageInfo.navFirstPage).toEqual(1);
      expect(pageInfo.navLastPage).toEqual(1);
  });

  it('page invalid nulls', () => {
      const pageInfo = new PageInfo(null, null, '');

      expect(pageInfo.page).toEqual(1);
      expect(pageInfo.limit).toEqual(5);
      expect(pageInfo.offset).toEqual(0);
  });
  it('page fractional numbers', () => {
      const pageInfo = new PageInfo(3.3, 3.3, '');

      expect(pageInfo.page).toEqual(3);
      expect(pageInfo.limit).toEqual(3);
      expect(pageInfo.offset).toEqual(6);
  });
  it('172 items 5 per page', () => {
      const pageInfo = new PageInfo(1, 5, '');
      pageInfo.dataSize = 172
      expect(pageInfo.navLastPage).toEqual(35);

  });
  it('27 items 5 per page', () => {
      const pageInfo = new PageInfo(1, 5, '');
      pageInfo.dataSize = 27
      expect(pageInfo.navLastPage).toEqual(6);
  });
  it('30 items 5 per page', () => {
      const pageInfo = new PageInfo(1, 5, '');
      pageInfo.dataSize = 30
      expect(pageInfo.navLastPage).toEqual(6);
  });
  it('19 items 5 per page', () => {
      const pageInfo = new PageInfo(1, 5, '');
      pageInfo.dataSize = 19
      expect(pageInfo.navLastPage).toEqual(4);
  });
  it('40 items 5 per page', () => {
      const pageInfo = new PageInfo(1, 5, '');
      pageInfo.dataSize = 40
      expect(pageInfo.navLastPage).toEqual(8);
  });
//Page  1   2   3   4   5   6    7   8
//------------------------------------
//////  1	6	11	16	21	26	31	36
//////  2	7	12	17	22	27	32	37
//////  3	8	13	18	23	28	33	38
//////  4	9	14	19	24	29	34	39
//////  5	10	15	20	25	30	35	40




});
