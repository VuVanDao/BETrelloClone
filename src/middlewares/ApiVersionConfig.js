import { StatusCodes } from "http-status-codes";

const urlVersioning = (version) => (req, res, next) => {
  if (req.path.startsWith(`/${version}/api`)) {
    //req.path.startsWith(`/api/${version}`)
    next();
  } else {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "API version not supported",
    });
  }
};

export { urlVersioning };
