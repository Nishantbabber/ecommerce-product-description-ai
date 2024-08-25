const checkSubscriptionLimits = async (req, res, next) => {
    try {
        const { subscriptionStatus } = req.user;

        if (!subscriptionStatus) {
            return res.status(500).json({ msg: 'Subscription information is missing.' });
        }

        const trialDurationInDays = 7;
        const trialEndDate = new Date(new Date(req.user.createdAt).getTime() + trialDurationInDays * 24 * 60 * 60 * 1000);

        if (subscriptionStatus.status === 'trial' && trialEndDate < Date.now()) {
            return res.status(403).json({ msg: 'Trial period has ended. Please subscribe to continue.' });
        }

        if (subscriptionStatus.productLimit <= 0) {
            return res.status(403).json({ msg: 'Product limit reached. Please subscribe to continue.' });
        }

        if (subscriptionStatus.enhanceLimit <= 0) {
            return res.status(403).json({ msg: 'Enhancement limit reached. Please subscribe to continue.' });
        }

        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error in subscription check' });
    }
};

module.exports = checkSubscriptionLimits;
