export const getCSRFToken = async (req, res) => {
    return res.json({csrfToken: req.csrfToken()})
}