import helmet from "helmet";
const initHelmet = (app) => {
  app.use(helmet())
}
export default initHelmet;