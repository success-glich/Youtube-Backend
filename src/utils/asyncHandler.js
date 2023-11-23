
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(err => next(err))
    }
}


export { asyncHandler };


// * Alternative way to achieve async Handler

// const asyncHandler = (fn) => async (err, req, res, next) => {
//     try {
//         await fn(err, req, res, next);

//     } catch (error) {
//         res.status(error.code || 5000).json({
//             success: false,
//             message: error.message
//         })
//     }
// }