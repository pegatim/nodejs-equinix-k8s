'use strict'
var express = require("express");

var path = require('path');
var dotEnvPath = path.resolve('./.env');

require('dotenv').config({ path: dotEnvPath});

const workVisitTemplate = require('./EquinixWorkVisitTemplate')
const smartHandsTemplate = require('./EquinixSmartHandsTemplate')
const troubleTicketTemplate = require('./EquinixTroubleTicketTemplate')
const shipmentTemplate = require('./EquinixShipmentTemplate')
const crossConnectTemplate = require('./EquinixCrossConnectTemplate')
const safeStringify = require('fast-safe-stringify');

var ORDER_NUMBER = process.env.ORDER_NUMBER;
var CLIENT_ID = process.env.CLIENT_ID; // Will be supplied by Customer
var CLIENT_SECRET = process.env.CLIENT_SECRET; // Will be supplied by Customer

const NOTIFICATION_PENDING_CUSTOMER_INPUT = "Pending Customer Input";
const NOTIFICATION_OPEN = "Open";
const NOTIFICATION_INPROGRESS = "InProgress";
const NOTIFICATION_CANCELLED = "Cancelled";

const CREATE_WORKVISIT_PAYLOAD = {
    "CustomerContact": "<CUSTOMER_CONTACT>",
    "RequestorId": "102894102Test1234",
    "RequestorIdUnique": false,
    "Location": "<LOCATION>",
    "Attachments": [],
    "Description": "Test description for WorkVisit Create",
    "ServiceDetails": {
        "StartDateTime": "2020-09-20T07:05:00.000Z",
        "EndDateTime": "2020-09-21T10:00:00Z",
        "OpenCabinet": true,
        "Visitors": [
            {
                "FirstName": "Test FirstName",
                "LastName": "Test LastName",
                "CompanyName": "Test Company"
            }
        ]
    }
}

const UPDATE_WORKVISIT_PAYLOAD = {
    "ServicerId": ORDER_NUMBER,
    "Attachments": [],
    "Description": "Test description for WorkVisit Update",
    "ServiceDetails": {
        "StartDateTime": "2020-09-25T07:05:00.000Z",
        "EndDateTime": "2020-09-26T10:00:00Z",
        "OpenCabinet": false,
        "Visitors": [
            {
                "FirstName": "Test FirstName",
                "LastName": "Test LastName",
                "CompanyName": "Test Company"
            }
        ]
    }
}

const CANCEL_WORKVISIT_PAYLOAD = {
    "State": "Cancelled",
    "ServicerId": ORDER_NUMBER,
    "Description": "Test description for WorkVisit Cancel",
}


const CREATE_WORKVISIT_PAYLOAD_AS_PER_API_SCHEMA = {
    "ibxLocation": {
        "cages": [
            {
                "cage": "AM5:01:000Z3A",
                "accountNumber":"300134"

            }
        ],
        "ibx": "AM5"
    },
    "attachments": [],
    "customerReferenceNumber": "102894102Test1234",
    "serviceDetails": {
        "schedule": {
            "startDateTime": "2020-11-05T07:05:00.000Z",
            "endDateTime": "2020-11-06T10:00:00Z"
        },
        "openCabinet": true,
        "additionalDetails": "Test description for WorkVisit Create",
        "visitors": [
            {
                "firstName": "Test FirstName",
                "lastName": "Test LastName",
                "company": "Test Company"
            }
        ]
    },
    "contacts": [
        {
            "contactType": "ORDERING",
            "userName": "cadmin"
        },
        {
            "contactType": "TECHNICAL",
            "userName": "cadmin",
            "workPhonePrefToCall": "ANYTIME"
        },
        {
            "contactType": "NOTIFICATION",
            "userName": "cadmin"
        }
    ]
}

const UPDATE_WORKVISIT_PAYLOAD_AS_PER_API_SCHEMA = {
    "attachments": [],
    "orderNumber": ORDER_NUMBER,
    "serviceDetails": {
        "startDateTime": "2020-11-02T07:05:00.000Z",
        "endDateTime": "2020-11-04T10:00:00Z",
        "openCabinet": false,
        "additionalDetails": "Test description for WorkVisit Update",
        "visitors": [
            {
                "firstName": "Test FirstName New",
                "lastName": "Test LastName New",
                "company": "Test Company New"
            }
        ]
    }
}

const CANCEL_WORKVISIT_PAYLOAD_AS_PER_API_SCHEMA = {
    "orderNumber": ORDER_NUMBER,
    "cancellationReason": "Test description for WorkVisit Cancel"
}


const CREATE_SMARTHAND_PAYLOAD = {
    "CustomerContact": "cadmin",
    "Attachments": [],
    "RequestorId": "102894102Test1234",
    "RequestorIdUnique": false,
    "Operation": "0000",
    "Location": "AM5:01:000Z3A",
    "Description": "Test description for SmartHands Create",
    "SchedulingDetails": {
        "RequestedStartDate": "2020-19-20T07:05:00.000Z",
        "RequestedCompletionDate": "2020-21-20T07:05:00.000Z"
    }
}

const UPDATE_SMARTHAND_PAYLOAD = {
    "ServicerId": ORDER_NUMBER,
    "Attachments": [],
    "Description": "Test description for SmartHands Update"
}

const CANCEL_SMARTHAND_PAYLOAD = {
    "State": "Cancelled",
    "ServicerId": ORDER_NUMBER,
    "Description": "Test description for SmartHands Cancel"
}


const CREATE_TROUBLETICKET_PAYLOAD = {
    "RequestorId": "102894102Test1234",
    "IncidentDate": "2020-09-11T00:00:00+00:00",
    "Description": "Test description for TroubleTicket Create",
    "Attachments": [],
    "RequestorIdUnique": false,
    "Operation": "0005/0001",
    "Location": "<LOCATION>",
    "CallFromCage": true,
    "CustomerContact": "<CUSTOMER_CONTACT>",
    "Device": "<DEVICE>"
}

const UPDATE_TROUBLETICKET_PAYLOAD = {
    "RequestorId": "102894102Test1234",
    "Description": "Test description for TroubleTicket Update",
    "Attachments": [],
    "ServicerId": ORDER_NUMBER,
    "CallFromCage": false
}

const CANCEL_TROUBLETICKET_PAYLOAD = {
    "Description": "Test description for TroubleTicket Cancel",
    "ServicerId": ORDER_NUMBER,
    "State": "Cancelled"
}

const CREATE_INBOUNDSHIPMENT_CARRIERTYPE_PAYLOAD = {
    "RequestorId": "102894102Test1234",
    "RequestorIdUnique": false,
    "CustomerContact": "<CUSTOMER_CONTACT>",
    "Operation": "0000/0000",
    "Location": "<LOCATION>",
    "Description": "Test description for Inbound Shipment Create",
    "Attachments": [],
    "CarrierName": "TEST",
    "ShipmentDateTime": "2020-09-20T07:05:00.000Z",
    "ShipmentIdentifier": "TRACK123456",
    "ServiceDetails": {
      "NoOfBoxes": 99,
      "DeliverToCage": false
    }
}

const CREATE_INBOUNDSHIPMENT_CUSTOMERCARRYTYPE_PAYLOAD = {
    "RequestorId": "102894102Test1234",
    "RequestorIdUnique": false,
    "CustomerContact": "<CUSTOMER_CONTACT>",
    "Operation": "0000/0001",
    "Location": "<LOCATION>",
    "Description": "Test description for Inbound Shipment Create",
    "Attachments": [],
    "CarrierName": "TEST",
    "ShipmentDateTime": "2020-09-20T04:05:00.000Z",
    "ServiceDetails": {
      "NoOfBoxes": 99,
      "DeliverToCage": false
    }
}

const CREATE_OUTBOUNDSHIPMENT_CARRIERTYPE_PAYLOAD = {
    "RequestorId": "102894102Test1234",
    "RequestorIdUnique": false,
    "Operation": "0001/0000",
    "Location": "<LOCATION>",
    "CustomerContact": "<CUSTOMER_CONTACT>",
    "Description": "Test description for Outbound Shipment Create",
    "Attachments": [],
    "CarrierName": "TEST",
    "ShipmentIdentifier": "12345dse456546456",
    "ShipmentDateTime": "2020-09-20T10:05:00.000Z",
    "ShipmentLabel": [{ "Name": "atta1.jpeg", "Url": "https://eqixazurestorage.blob.core.windows.net/emg-download-blob/atta1.jpeg" }],
    "ShipmentLabelInsideBox": false,
    "ServiceDetails": {
          "NoOfBoxes": 3,
          "DeclaredValue": "3",
          "ShipmentDescription": "Test ShipmentDescription",
          "ShipToName": "test",
          "ShipToAddress": "1188 test address",
          "ShipToCity": "Sunnyvale",
          "ShipToCountry": "US",
          "ShipToState": "CALIFORNIA",
          "ShipToZipCode": "94085",
          "ShipToPhoneNumber": "+1 1331313",
          "ShipToCarrierAccountNumber": "111",
          "InsureShipment": false,
          "PickUpFromCageSuite": false,
        }
}

const CREATE_OUTBOUNDSHIPMENT_CUSTOMERCARRYTYPE_PAYLOAD = {
    "RequestorId": "102894102Test1234",
    "RequestorIdUnique": false,
    "Operation": "0001/0001",
    "Location": "<LOCATION>",
    "CustomerContact": "<CUSTOMER_CONTACT>",
    "Description": "Test description for Outbound Shipment Create",
    "Attachments": [],
    "ShipmentDateTime": "2020-09-20T07:05:00.000Z",
    "ShipmentLabelInsideBox": false
}

const UPDATE_INBOUNDSHIPMENT_PAYLOAD = {
    "RequestorId": "102894102Test1234",
    "ServicerId": ORDER_NUMBER,
    "Description": "Test description for Inbound Shipment Update",
    "Attachments": [],
    "CarrierName": "OTHER",
    "ServiceDetails": {
        "NoOfBoxes": 999,
        "DeliverToCage": true
    }
}

const UPDATE_OUTBOUNDSHIPMENT_PAYLOAD = {
    "RequestorId": "102894102Test1234",
    "ServicerId": ORDER_NUMBER,
    "Attachments": [],
    "Description": "Test description for Outbound Shipment Update",
    "ShipmentIdentifier": "12345dse456546456",
    "ShipmentDateTime": "2020-09-20T07:05:00.000Z",
    "CarrierName": "OTHER",
    "ShipmentLabelInsideBox": true,
    "ServiceDetails": {
      "NoOfBoxes": 3,
      "DeclaredValue": "3",
      "ShipmentDescription": "Test ShipmentDescription",
      "ShipToName": "test",
      "ShipToAddress": "1188 test address",
      "ShipToCity": "Sunnyvale",
      "ShipToCountry": "US",
      "ShipToState": "CALIFORNIA",
      "ShipToZipCode": "94085",
      "ShipToPhoneNumber": "+1 1331313",
      "ShipToCarrierAccountNumber": "111",
      "InsureShipment": false,
      "PickUpFromCageSuite": false,
    }
}

const CANCEL_SHIPMENT_PAYLOAD = {
    "Description": "Test description for Shipment Cancel",
    "RequestorId": "102894102Test1234",
    "ServicerId": ORDER_NUMBER,
    "State": "Cancelled"
}
const bodyParser = require('body-parser');

const winston = require("winston");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

const app = express();
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.raw());

// log each request
app.use((req, res, next) => {
        logger.info(`Received a ${req.method} request for ${req.url}`);
	next();
});

// log error message
app.use((err, req, res, next) => {
        logger.error(err.message);
        res.status(500).send();
});

// support healthcheck
app.get("/ping", (req, res, next) => {
        res.json({ value: "pong" });
})

app.post("/create_work_visit", async (req, res, next) => {
	logger.log("info", "Sending Create WorkVisit Request Message  **********")
	console.log (req.body)
	    // logger.log("info", req.param("ClientID"))
	    // logger.log("info", req.param("ClientSecretKey"))
        const result = await workVisitTemplate.createWorkVisit(
            JSON.stringify(req.body),
            req.param("ClientID"),
            req.param("ClientSecretKey")
	);
       logger.log("info", "Receiving Create WorkVisit Response Message  **********", safeStringify(result))
       res.json(result);
});

app.post("/update_work_visit", async (req, res, next) => {
	logger.log("info", "Sending Update WorkVisit Request Message  **********")
	console.log (req.body)
	// logger.log("info", req.param("ClientID"))
	// logger.log("info", req.param("ClientSecretKey"))
        const result = await workVisitTemplate.updateWorkVisit(
            JSON.stringify(req.body),
            req.param("ClientID"),
            req.param("ClientSecretKey")
        );
        logger.log("info", "Receiving Update WorkVisit Response Message  **********", safeStringify(result))
        res.json(result);
});

app.post("/cancel_work_visit", async (req, res, next) => {
	logger.log("info", "Sending Update WorkVisit Request Message  **********")
        const result = await workVisitTemplate.cancelWorkVisit(
            JSON.stringify(req.body),
            CLIENT_ID,
            CLIENT_SECRET
        )
        logger.log("info", "Receiving Update WorkVisit Response Message  **********", safeStringify(result))
        res.json(result);
});


app.post("/create_work_visitExtn", async (req, res, next) => {
	logger.log("info", "Sending Create WorkVisit Request Message  **********")
        const result = await workVisitTemplate.createWorkVisitExtn(
            JSON.stringify(req.body),
            CLIENT_ID,
            CLIENT_SECRET
        );
        logger.log("info", "Receiving Create WorkVisit Response Message  **********", safeStringify(result))
        res.json(result);
});

app.post("/update_work_visitExtn", async (req, res, next) => {
	logger.log("info", "Sending Update WorkVisit Request Message  **********")
        const result = await workVisitTemplate.updateWorkVisitExtn(
            JSON.stringify(req.body),
            CLIENT_ID,
            CLIENT_SECRET
        )
        logger.log("info", "Receiving Update WorkVisit Response Message  **********", safeStringify(result))
        res.json(result);
});

app.post("/cancel_work_visitExtn", async (req, res, next) => {
	logger.log("info", "Sending Update WorkVisit Request Message  **********")
        const result = await workVisitTemplate.cancelWorkVisitExtn(
            JSON.stringify(req.body),
            CLIENT_ID,
            CLIENT_SECRET
        )
        logger.log("info", "Receiving Update WorkVisit Response Message  **********", safeStringify(result))
        res.json(result);
});

app.post("/create_smarthandv1", async (req, res, next) => {
	logger.log("info", "Sending Create WorkVisit Request Message  **********")
        const result = await smartHandsTemplate.createSmartHands(
            JSON.stringify(req.body),
            CLIENT_ID,
            CLIENT_SECRET
        );
        logger.log("info", "Receiving Create WorkVisit Response Message  **********", safeStringify(result))
        res.json(result);
});

app.post("/create_smarthand", async (req, res, next) => {
	logger.log("info", "Sending Create WorkVisit Request Message  **********")
        const result = await smartHandsTemplate.createSmartHands(
            JSON.stringify(req.body),
            req.param("ClientID"),
            req.param("ClientSecretKey")
        );
        logger.log("info", "Receiving Create WorkVisit Response Message  **********", safeStringify(result))
        res.json(result);
});

app.post("/update_work_visit", async (req, res, next) => {
	logger.log("info", "Sending Update WorkVisit Request Message  **********")
        const result = await workVisitTemplate.updateWorkVisit(
            JSON.stringify(req.body),
            CLIENT_ID,
            CLIENT_SECRET
        )
        logger.log("info", "Receiving Update WorkVisit Response Message  **********", safeStringify(result))
        res.json(result);
});

app.post("/cancel_work_visit", async (req, res, next) => {
	logger.log("info", "Sending Update WorkVisit Request Message  **********")
        const result = await workVisitTemplate.cancelWorkVisit(
            JSON.stringify(req.body),
            CLIENT_ID,
            CLIENT_SECRET
        )
        logger.log("info", "Receiving Update WorkVisit Response Message  **********", safeStringify(result))
        res.json(result);
});

app.post("/update_smarthand", async (req, res, next) => {
	logger.log("info", "Sending Update WorkVisit Request Message  **********")
	console.log (req.body)
	// logger.log("info", req.param("ClientID"))
	// logger.log("info", req.param("ClientSecretKey"))
        const result = await smartHandsTemplate.updateSmartHands(
            JSON.stringify(req.body),
            req.param("ClientID"),
            req.param("ClientSecretKey")
        );
        logger.log("info", "Receiving Update WorkVisit Response Message  **********", safeStringify(result))
        res.json(result);
});

app.post("/cancel_smarthand", async (req, res, next) => {
	logger.log("info", "Sending Create WorkVisit Request Message  **********")
        const result = await smartHandsTemplate.cancelSmartHands(
            JSON.stringify(req.body),
            CLIENT_ID,
            CLIENT_SECRET
        );
        logger.log("info", "Receiving Create WorkVisit Response Message  **********", safeStringify(result))
        res.json(result);
});

app.post("/create_crossconnect", async (req, res, next) => {
	logger.log("info", "Sending Create WorkVisit Request Message  **********")
        const result = await crossConnectTemplate.createCrossConnect(
            JSON.stringify(req.body),
            req.param("ClientID"),
            req.param("ClientSecretKey")
        );
        logger.log("info", "Receiving Create WorkVisit Response Message  **********", safeStringify(result))
        res.json(result);
});

app.listen(3000, () => {
        logger.log("info", "Server running on port 3000");
});
