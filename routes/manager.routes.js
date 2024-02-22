const express = require('express');
const router = express.Router();
var managerController = require('../controller/manager.controller');
var driverController = require('../controller/driver.controller');
var authController = require('../controller/auth.controller');
var reportController = require('../controller/report.controller');
var statisticController = require('../controller/statictis.controller');
var transactionController = require('../controller/transaction.controller');
const { loginARToken, refreshToken, logout } = require('../services/auth.service');
const { TokenCheckMiddleware } = require('../auth/auth');

//Auth
router.post('/login', loginARToken);
router.post('/refresh_token', refreshToken);
router.post('/logout', logout);
// Manager
router.get('/all-manager/:currentPage/:pageSize', managerController.getListManager);
router.get('/manager/:id', managerController.getManagerById);
router.post('/manager', managerController.addNew);
router.put('/manager/:id', managerController.updateManager);
router.put('/manager/ban/:id', managerController.deleteManager);

// Driver
router.get("/get-all-drivers/:currentPage/:pageSize", driverController.getDriverList);
router.get("/driver/:id", driverController.getDriverById);
router.post("/driver", driverController.addNew);
router.put("/driver/:id", driverController.updateDriver);
router.put("/driver/ban/:id", driverController.banDriver);
router.get("/driver/export", driverController.exportListDriver);

//Review and report
router.get("/review/:currentPage/:pageSize", reportController.getReviewList);
router.get("/review/:date/:currentPage/:pageSize", reportController.getReviewByDate);

//Statistic revenue
router.get("/statistic/driver", statisticController.getTotalDriver);
router.get("/statistic/review", statisticController.getTotalReview);
router.get("/statistic/income-driver", statisticController.getTotalIncomeDriver);
router.get("/statistic/trip/:time", statisticController.getTotalTrip);

//Transaction
router.get("/transaction/:currentPage/:pageSize", transactionController.getTransaction);

module.exports = router;