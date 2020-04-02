describe("Environment", () => {

  it('Display Environment', () => {
    expect(process.env.PG_USER).not.toBe("");
    expect(process.env.PG_DATABASE).not.toBe("");
  })
});