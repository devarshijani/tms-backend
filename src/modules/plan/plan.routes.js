const express = require("express");
const router = express.Router();
const planController = require("./plan.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorize } = require("../../middlewares/rbac.middleware");
const { createPlanValidation, updatePlanValidation } = require("./plan.validation");

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const messages = error.details.map((d) => d.message).join(", ");
        return res.status(400).json({ success: false, message: messages });
    }
    next();
};

// Public: anyone can view plans (needed for registration page)
router.get("/", planController.getAllPlans);
router.get("/:id", planController.getPlanById);

// Protected: only superadmin can manage plans
router.post("/", authenticate, authorize("superadmin"), validate(createPlanValidation), planController.createPlan);
router.put("/:id", authenticate, authorize("superadmin"), validate(updatePlanValidation), planController.updatePlan);
router.delete("/:id", authenticate, authorize("superadmin"), planController.deletePlan);

module.exports = router;