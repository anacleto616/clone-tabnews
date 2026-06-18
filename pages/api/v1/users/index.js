import controller from "infra/controller.js";
import activation from "models/activation";
import authorization from "models/authorization";
import user from "models/user.js";
import { createRouter } from "next-connect";

export default createRouter()
  .use(controller.injectAnonymousOrUser)
  .post(controller.canRequest("create:user"), postHandler)
  .handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userTryingToPost = request.context.user;
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);

  const secureOutputValues = authorization.filterOutput(
    userTryingToPost,
    "read:user",
    newUser,
  );

  const activationToken = await activation.create(newUser.id);
  await activation.sendEmailToUser(newUser, activationToken);

  return response.status(201).json(secureOutputValues);
}
