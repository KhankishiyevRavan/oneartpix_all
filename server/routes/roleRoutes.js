const express = require('express');
const router = express.Router();
const roleController = require("../controllers/RoleController");

router.get('/', roleController.getRoles);


router.post('/create-role', roleController.createRole);

router.get('/:id', roleController.getRoleById);

router.get('/name/:name', roleController.getRoleByName);

router.put("/edit-role/:id", roleController.updateRole);

module.exports = router;