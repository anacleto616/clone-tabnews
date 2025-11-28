import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => orchestrator.waitForAllServices());

describe("infra/email.js", () => {
  test("send()", async () => {
    orchestrator.deleteAllEmails();

    await email.send({
      from: "Anacleto <contato@anacleto.com.br>",
      to: "rafael.anacleto12@gmail.com",
      subject: "Teste de Assunto",
      text: "Teste de corpo.",
    });

    await email.send({
      from: "Anacleto <contato@anacleto.com.br>",
      to: "rafael.anacleto12@gmail.com",
      subject: "Último email enviado",
      text: "Corpo do último email.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@anacleto.com.br>");
    expect(lastEmail.recipients[0]).toBe("<rafael.anacleto12@gmail.com>");
    expect(lastEmail.subject).toBe("Último email enviado");
    expect(lastEmail.text).toBe("Corpo do último email.\r\n");
  });
});
