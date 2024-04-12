

//! By Promises
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(
      requestHandler(req, res, next)
      .catch((error) => next(error))
    );
  };
};

//! By async await
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message || "An unknown error occurred! 🎡",
//     });
//   }
// };

export  {asyncHandler};
