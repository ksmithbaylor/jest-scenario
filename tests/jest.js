describe('Jest integration', () => {
  it('Runs one single test', () => {
    expect(1).toBe(1);
  });

  scenario('Simple scenario', {
    small: { one: 1, two: 2, three: 3, expected: 6 },
    big: { one: 123, two: 456, three: 789, expected: 1368 }
  }, ({ one, two, three, expected }) => {
    expect(one + two + three).toBe(expected);
  });

  scenarioOutline('Outline', {
    stuff: [1, 2, 3, 4, 5],
    things: ['a', 'b', 'c', 'd']
  }, ({ stuff, things }) => {
    expect(String(stuff) + things).toHaveLength(2);
  });
});
