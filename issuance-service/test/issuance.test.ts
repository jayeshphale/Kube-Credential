import request from "supertest";
import app from "../src/server";

describe("Issuance API", () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  it("issues a credential and returns worker id", async () => {
    const res = await request(app)
      .post('/issue')
      .send({ id: 'test-1', name: 'Alice', course: 'Kubernetes' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/credential issued by worker-/);
  });

  it("returns already issued for duplicate id", async () => {
    // Issue once
    await request(app)
      .post('/issue')
      .send({ id: 'dup-1', name: 'Bob', course: 'Cloud' })
      .set('Accept', 'application/json');

    const res2 = await request(app)
      .post('/issue')
      .send({ id: 'dup-1', name: 'Bob', course: 'Cloud' })
      .set('Accept', 'application/json');

    expect(res2.status).toBe(200);
    expect(res2.body.message).toBe('credential already issued');
  });
});
