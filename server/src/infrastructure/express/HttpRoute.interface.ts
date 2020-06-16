import { Router } from "express";

interface HttpRoute {
  path?: string;
  router: Router;
}

export default HttpRoute;
