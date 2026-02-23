import request from "supertest";
import app from "../src/server";

describe("Verification API", () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  it("returns not found for unknown id", async () => {
    const res = await request(app)
      .post('/verify')
      .send({ id: 'no-such-id' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
  });

  it("stores via internal store and verifies", async () => {
    // store via internal endpoint
    const store = await request(app)
      .post('/verify/internal/store')
      .send({ id: 'v-1', name: 'Carol', course: 'DevOps', issuedAt: new Date().toISOString() });

    expect(store.status).toBe(200);

    const verify = await request(app)
      .post('/verify')
      .send({ id: 'v-1' })
      .set('Accept', 'application/json');

    expect(verify.status).toBe(200);
    expect(verify.body.valid).toBe(true);
    expect(verify.body.verifiedBy).toMatch(/worker-/);
    expect(verify.body.timestamp).toBeTruthy();
  });
});
