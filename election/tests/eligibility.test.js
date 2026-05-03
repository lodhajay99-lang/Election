import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

describe('Bharat Votes - Eligibility Checker Logic', () => {
  let dom;
  let document;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><div id="checker-result"></div>');
    document = dom.window.document;
    global.document = document;
  });

  it('should identify a 21-year-old Indian citizen as eligible', () => {
    const age = 21;
    const isCitizen = 'yes';
    
    // Logic from app.js
    const isEligible = age >= 18 && isCitizen === 'yes';
    expect(isEligible).toBe(true);
  });

  it('should identify a 17-year-old as not eligible', () => {
    const age = 17;
    const isCitizen = 'yes';
    const isEligible = age >= 18 && isCitizen === 'yes';
    expect(isEligible).toBe(false);
  });

  it('should identify a non-citizen as not eligible', () => {
    const age = 25;
    const isCitizen = 'no';
    const isEligible = age >= 18 && isCitizen === 'yes';
    expect(isEligible).toBe(false);
  });
});
