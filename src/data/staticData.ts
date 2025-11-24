import { ProcessDto, ProcessEventDto, RfqStateDto, PoStateDto, PagedList } from '../types';
// Static Process List
export const STATIC_PROCESSES: ProcessDto[] = [{
  id: 1,
  correlationId: 'E-20251121-222492a23985-mouazabdelsamad',
  requesterEmail: 'mouaz.abdelsamad@outlook.com',
  route: 2,
  status: 20,
  customerName: 'Mouaz Abdelsamad Tech',
  createdAt: '2025-11-21T14:43:01.036',
  updatedAt: '2025-11-21T14:43:56.211'
}, {
  id: 2,
  correlationId: 'E-20251115-cf4049c5380e-mouazabdelsamad',
  requesterEmail: 'mouaz.abdelsamad@outlook.com',
  route: 2,
  status: 90,
  customerName: null,
  createdAt: '2025-11-15T11:33:14.979',
  updatedAt: '2025-11-15T11:33:23.922'
}, {
  id: 3,
  correlationId: 'E-20251121-79420988a318-mouazabdelsamad',
  requesterEmail: 'mouaz.abdelsamad@outlook.com',
  route: 3,
  status: 20,
  customerName: 'Mouaz Abdelsamad Tech',
  createdAt: '2025-11-21T15:53:04.791',
  updatedAt: '2025-11-21T16:01:18.174'
}, {
  id: 4,
  correlationId: 'E-20251121-9f44c8719dee-mouazabdelsamad',
  requesterEmail: 'mouaz.abdelsamad@outlook.com',
  route: 3,
  status: 90,
  customerName: 'Mouaz Abdelsamad Tech',
  createdAt: '2025-11-21T11:36:36.2',
  updatedAt: '2025-11-21T11:46:13.478'
},
// Processes with no payload, just used for testing pagination purposes
{
  id: 5,
  correlationId: 'E-20251120-a1b2c3d4e5f6-test',
  requesterEmail: 'test.user@example.com',
  route: 2,
  status: 20,
  customerName: 'Test Company A',
  createdAt: '2025-11-20T10:15:30.123',
  updatedAt: '2025-11-20T10:20:45.456'
}, {
  id: 6,
  correlationId: 'E-20251120-b2c3d4e5f6a7-test',
  requesterEmail: 'user@test.com',
  route: 3,
  status: 10,
  customerName: null,
  createdAt: '2025-11-20T09:30:15.789',
  updatedAt: '2025-11-20T09:35:22.012'
}, {
  id: 7,
  correlationId: 'E-20251119-c3d4e5f6a7b8-test',
  requesterEmail: 'admin@company.com',
  route: 2,
  status: 21,
  customerName: 'Tech Solutions Inc',
  createdAt: '2025-11-19T14:22:10.345',
  updatedAt: '2025-11-19T14:28:33.678'
}, {
  id: 8,
  correlationId: 'E-20251119-d4e5f6a7b8c9-test',
  requesterEmail: 'sales@business.com',
  route: 3,
  status: 30,
  customerName: 'Business Corp',
  createdAt: '2025-11-19T11:45:20.901',
  updatedAt: '2025-11-19T11:50:15.234'
}, {
  id: 9,
  correlationId: 'E-20251118-e5f6a7b8c9d0-test',
  requesterEmail: 'contact@startup.io',
  route: 1,
  status: 10,
  customerName: null,
  createdAt: '2025-11-18T16:10:40.567',
  updatedAt: '2025-11-18T16:15:55.890'
}, {
  id: 10,
  correlationId: 'E-20251118-f6a7b8c9d0e1-test',
  requesterEmail: 'info@enterprise.com',
  route: 2,
  status: 20,
  customerName: 'Enterprise Solutions',
  createdAt: '2025-11-18T13:25:30.123',
  updatedAt: '2025-11-18T13:32:45.456'
}, {
  id: 11,
  correlationId: 'E-20251117-a7b8c9d0e1f2-test',
  requesterEmail: 'procurement@company.com',
  route: 3,
  status: 20,
  customerName: 'Global Trading Ltd',
  createdAt: '2025-11-17T10:40:20.789',
  updatedAt: '2025-11-17T10:48:35.012'
}, {
  id: 12,
  correlationId: 'E-20251117-b8c9d0e1f2a3-test',
  requesterEmail: 'orders@supplier.com',
  route: 2,
  status: 90,
  customerName: null,
  createdAt: '2025-11-17T08:15:10.345',
  updatedAt: '2025-11-17T08:20:25.678'
}, {
  id: 13,
  correlationId: 'E-20251116-c9d0e1f2a3b4-test',
  requesterEmail: 'rfq@manufacturing.com',
  route: 2,
  status: 20,
  customerName: 'Manufacturing Co',
  createdAt: '2025-11-16T15:30:40.901',
  updatedAt: '2025-11-16T15:38:55.234'
}, {
  id: 14,
  correlationId: 'E-20251116-d0e1f2a3b4c5-test',
  requesterEmail: 'purchase@logistics.com',
  route: 3,
  status: 21,
  customerName: 'Logistics Partners',
  createdAt: '2025-11-16T12:20:30.567',
  updatedAt: '2025-11-16T12:28:45.890'
}, {
  id: 15,
  correlationId: 'E-20251115-e1f2a3b4c5d6-test',
  requesterEmail: 'buying@retail.com',
  route: 3,
  status: 10,
  customerName: null,
  createdAt: '2025-11-15T09:45:20.123',
  updatedAt: '2025-11-15T09:50:35.456'
}, {
  id: 16,
  correlationId: 'E-20251115-f2a3b4c5d6e7-test',
  requesterEmail: 'quotes@distributor.com',
  route: 2,
  status: 20,
  customerName: 'Distribution Network',
  createdAt: '2025-11-15T14:10:40.789',
  updatedAt: '2025-11-15T14:18:55.012'
}, {
  id: 17,
  correlationId: 'E-20251114-a3b4c5d6e7f8-test',
  requesterEmail: 'vendor@wholesale.com',
  route: 3,
  status: 20,
  customerName: 'Wholesale Group',
  createdAt: '2025-11-14T11:25:30.345',
  updatedAt: '2025-11-14T11:33:45.678'
}, {
  id: 18,
  correlationId: 'E-20251114-b4c5d6e7f8a9-test',
  requesterEmail: 'supply@chain.com',
  route: 2,
  status: 90,
  customerName: null,
  createdAt: '2025-11-14T08:40:20.901',
  updatedAt: '2025-11-14T08:45:35.234'
}, {
  id: 19,
  correlationId: 'E-20251113-c5d6e7f8a9b0-test',
  requesterEmail: 'materials@construction.com',
  route: 3,
  status: 30,
  customerName: 'Construction Inc',
  createdAt: '2025-11-13T16:15:40.567',
  updatedAt: '2025-11-13T16:20:55.890'
}, {
  id: 20,
  correlationId: 'E-20251113-d6e7f8a9b0c1-test',
  requesterEmail: 'parts@automotive.com',
  route: 2,
  status: 20,
  customerName: 'Automotive Parts Ltd',
  createdAt: '2025-11-13T13:30:30.123',
  updatedAt: '2025-11-13T13:38:45.456'
}, {
  id: 21,
  correlationId: 'E-20251112-e7f8a9b0c1d2-test',
  requesterEmail: 'components@electronics.com',
  route: 3,
  status: 20,
  customerName: 'Electronics Corp',
  createdAt: '2025-11-12T10:50:20.789',
  updatedAt: '2025-11-12T10:58:35.012'
}, {
  id: 22,
  correlationId: 'E-20251112-f8a9b0c1d2e3-test',
  requesterEmail: 'equipment@industrial.com',
  route: 2,
  status: 21,
  customerName: 'Industrial Equipment',
  createdAt: '2025-11-12T07:20:40.345',
  updatedAt: '2025-11-12T07:28:55.678'
}, {
  id: 23,
  correlationId: 'E-20251111-a9b0c1d2e3f4-test',
  requesterEmail: 'tools@hardware.com',
  route: 3,
  status: 10,
  customerName: null,
  createdAt: '2025-11-11T15:40:30.901',
  updatedAt: '2025-11-11T15:45:45.234'
}, {
  id: 24,
  correlationId: 'E-20251111-b0c1d2e3f4a5-test',
  requesterEmail: 'machinery@factory.com',
  route: 2,
  status: 20,
  customerName: 'Factory Machinery Co',
  createdAt: '2025-11-11T12:15:20.567',
  updatedAt: '2025-11-11T12:23:35.890'
}, {
  id: 25,
  correlationId: 'E-20251110-c1d2e3f4a5b6-test',
  requesterEmail: 'supplies@office.com',
  route: 3,
  status: 20,
  customerName: 'Office Supplies Plus',
  createdAt: '2025-11-10T09:30:40.123',
  updatedAt: '2025-11-10T09:38:55.456'
}, {
  id: 26,
  correlationId: 'E-20251110-d2e3f4a5b6c7-test',
  requesterEmail: 'medical@healthcare.com',
  route: 2,
  status: 90,
  customerName: null,
  createdAt: '2025-11-10T14:45:30.789',
  updatedAt: '2025-11-10T14:50:45.012'
}, {
  id: 27,
  correlationId: 'E-20251109-e3f4a5b6c7d8-test',
  requesterEmail: 'pharma@drugs.com',
  route: 3,
  status: 21,
  customerName: 'Pharmaceutical Group',
  createdAt: '2025-11-09T11:20:20.345',
  updatedAt: '2025-11-09T11:28:35.678'
}, {
  id: 28,
  correlationId: 'E-20251109-f4a5b6c7d8e9-test',
  requesterEmail: 'chemicals@lab.com',
  route: 2,
  status: 20,
  customerName: 'Laboratory Chemicals',
  createdAt: '2025-11-09T08:35:40.901',
  updatedAt: '2025-11-09T08:43:55.234'
}, {
  id: 29,
  correlationId: 'E-20251108-a5b6c7d8e9f0-test',
  requesterEmail: 'food@restaurant.com',
  route: 3,
  status: 30,
  customerName: 'Restaurant Supply',
  createdAt: '2025-11-08T16:50:30.567',
  updatedAt: '2025-11-08T16:55:45.890'
}, {
  id: 30,
  correlationId: 'E-20251108-b6c7d8e9f0a1-test',
  requesterEmail: 'beverage@drinks.com',
  route: 2,
  status: 20,
  customerName: 'Beverage Distributors',
  createdAt: '2025-11-08T13:10:20.123',
  updatedAt: '2025-11-08T13:18:35.456'
}];
// Static Process Events
export const STATIC_EVENTS: {
  [correlationId: string]: PagedList<ProcessEventDto>;
} = {
  'E-20251121-222492a23985-mouazabdelsamad': {
    items: [{
      id: 1066,
      correlationId: 'E-20251121-222492a23985-mouazabdelsamad',
      mqMessageId: '149c0000-03fa-4c68-d73a-08de28fb8109',
      eventType: 'EmailReceived',
      receivedAt: '2025-11-21T14:43:01.036',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 1067,
      correlationId: 'E-20251121-222492a23985-mouazabdelsamad',
      mqMessageId: '14710000-03fa-4c68-b777-08de28fb86f7',
      eventType: 'RfqDetected',
      receivedAt: '2025-11-21T14:43:10.032',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 1068,
      correlationId: 'E-20251121-222492a23985-mouazabdelsamad',
      mqMessageId: '14710000-03fa-4c68-4754-08de28fb86ff',
      eventType: 'SendEmail',
      receivedAt: '2025-11-21T14:43:10.175',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 1069,
      correlationId: 'E-20251121-222492a23985-mouazabdelsamad',
      mqMessageId: '149c0000-03fa-4c68-bb93-08de28fb8880',
      eventType: 'EmailSent',
      receivedAt: '2025-11-21T14:43:12.545',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 1070,
      correlationId: 'E-20251121-222492a23985-mouazabdelsamad',
      mqMessageId: '54a00000-03fa-4c68-9c84-08de28fba283',
      eventType: 'QuotationPrepared',
      receivedAt: '2025-11-21T14:43:56.211',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }],
    page: 1,
    pageSize: 50,
    totalCount: 5,
    hasNextPage: false,
    hasPreviousPage: false
  },
  'E-20251115-cf4049c5380e-mouazabdelsamad': {
    items: [{
      id: 69,
      correlationId: 'E-20251115-cf4049c5380e-mouazabdelsamad',
      mqMessageId: 'b07a0000-03fa-4c68-a330-08de242a0084',
      eventType: 'EmailReceived',
      receivedAt: '2025-11-15T11:33:14.979',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 70,
      correlationId: 'E-20251115-cf4049c5380e-mouazabdelsamad',
      mqMessageId: '44750000-03fa-4c68-3096-08de242a03c5',
      eventType: 'RfqDetected',
      receivedAt: '2025-11-15T11:33:20.401',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 71,
      correlationId: 'E-20251115-cf4049c5380e-mouazabdelsamad',
      mqMessageId: '44750000-03fa-4c68-20bc-08de242a03cb',
      eventType: 'SendEmail',
      receivedAt: '2025-11-15T11:33:20.435',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 72,
      correlationId: 'E-20251115-cf4049c5380e-mouazabdelsamad',
      mqMessageId: 'b07a0000-03fa-4c68-3da1-08de242a0539',
      eventType: 'EmailSent',
      receivedAt: '2025-11-15T11:33:22.826',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 73,
      correlationId: 'E-20251115-cf4049c5380e-mouazabdelsamad',
      mqMessageId: 'cc630000-03fa-4c68-a357-08de242a05de',
      eventType: 'RfqFailed',
      receivedAt: '2025-11-15T11:33:23.922',
      status: 0,
      errorMessages: ['None of the requested items could be found in ERPNext.', '89-01-07127, 1027-2-011-8088, 64300-212'],
      warningMessages: []
    }],
    page: 1,
    pageSize: 50,
    totalCount: 5,
    hasNextPage: false,
    hasPreviousPage: false
  },
  'E-20251121-79420988a318-mouazabdelsamad': {
    items: [{
      id: 1073,
      correlationId: 'E-20251121-79420988a318-mouazabdelsamad',
      mqMessageId: '78a40000-03fa-4c68-e24b-08de29054b41',
      eventType: 'EmailReceived',
      receivedAt: '2025-11-21T15:53:04.791',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 1074,
      correlationId: 'E-20251121-79420988a318-mouazabdelsamad',
      mqMessageId: '709b0000-03fa-4c68-8390-08de29055cb8',
      eventType: 'PoDetected',
      receivedAt: '2025-11-21T15:53:34.07',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 1075,
      correlationId: 'E-20251121-79420988a318-mouazabdelsamad',
      mqMessageId: '709b0000-03fa-4c68-c3fc-08de29055cba',
      eventType: 'SendEmail',
      receivedAt: '2025-11-21T15:53:34.144',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 1076,
      correlationId: 'E-20251121-79420988a318-mouazabdelsamad',
      mqMessageId: '78a40000-03fa-4c68-e158-08de29055e04',
      eventType: 'EmailSent',
      receivedAt: '2025-11-21T15:53:36.227',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 1077,
      correlationId: 'E-20251121-79420988a318-mouazabdelsamad',
      mqMessageId: 'ec810000-03fa-4c68-11a0-08de29067153',
      eventType: 'SalesOrderPrepared',
      receivedAt: '2025-11-21T16:01:18.174',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }],
    page: 1,
    pageSize: 50,
    totalCount: 5,
    hasNextPage: false,
    hasPreviousPage: false
  },
  'E-20251121-9f44c8719dee-mouazabdelsamad': {
    items: [{
      id: 1033,
      correlationId: 'E-20251121-9f44c8719dee-mouazabdelsamad',
      mqMessageId: 'b8770000-03fa-4c68-0426-08de28e176f1',
      eventType: 'EmailReceived',
      receivedAt: '2025-11-21T11:36:36.2',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 1034,
      correlationId: 'E-20251121-9f44c8719dee-mouazabdelsamad',
      mqMessageId: '90960000-03fa-4c68-568d-08de28e17dcf',
      eventType: 'PoDetected',
      receivedAt: '2025-11-21T11:36:47.701',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 1035,
      correlationId: 'E-20251121-9f44c8719dee-mouazabdelsamad',
      mqMessageId: '90960000-03fa-4c68-4cf9-08de28e17dd5',
      eventType: 'SendEmail',
      receivedAt: '2025-11-21T11:36:47.725',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 1036,
      correlationId: 'E-20251121-9f44c8719dee-mouazabdelsamad',
      mqMessageId: 'b8770000-03fa-4c68-4981-08de28e17f1d',
      eventType: 'EmailSent',
      receivedAt: '2025-11-21T11:36:49.868',
      status: 1,
      errorMessages: [],
      warningMessages: []
    }, {
      id: 1037,
      correlationId: 'E-20251121-9f44c8719dee-mouazabdelsamad',
      mqMessageId: '4c4a0000-03fa-4c68-3b35-08de28e2cf05',
      eventType: 'PoFailed',
      receivedAt: '2025-11-21T11:46:13.478',
      status: 0,
      errorMessages: ["Failed to deserialize ERPNext response from '/api/resource/Sales%20Order'."],
      warningMessages: []
    }],
    page: 1,
    pageSize: 50,
    totalCount: 5,
    hasNextPage: false,
    hasPreviousPage: false
  }
};
// Static RFQ States
export const STATIC_RFQ_STATES: {
  [correlationId: string]: RfqStateDto;
} = {
  'E-20251121-222492a23985-mouazabdelsamad': {
    id: 1,
    correlationId: 'E-20251121-222492a23985-mouazabdelsamad',
    requesterEmail: 'mouaz.abdelsamad@outlook.com',
    customerName: 'Mouaz Abdelsamad Tech',
    requestedItemsJson: '[{"PartNumber":"305766-4","Quantity":2,"Description":"IGNITOR PLUG","Condition":null,"UOM":null},{"PartNumber":"89-01-07127","Quantity":5,"Description":"HANDSET","Condition":null,"UOM":null},{"PartNumber":"1027-2-011-8088","Quantity":1,"Description":"SEAT BELT","Condition":null,"UOM":null},{"PartNumber":"40726G-02","Quantity":3,"Description":"HEAD SET - RAMP HANDLING, MODEL H10-13HX","Condition":null,"UOM":null}]',
    foundItemsJson: '[{"PartNumber":"PLUG-IGNITER PN: 305766-4 Con: New","Quantity":2,"Description":"IGNITOR PLUG","Condition":"New","UOM":"EA"},{"PartNumber":"HANDSET PN: 89-01-07127 Con: New","Quantity":5,"Description":"HANDSET","Condition":"New","UOM":"EA"},{"PartNumber":"SEAT-BELT PN: 1027-2-011-8088 Con: New","Quantity":1,"Description":"SEAT BELT","Condition":"New","UOM":"EA"},{"PartNumber":"HEADSET PN: 40726G-02 Con: New","Quantity":3,"Description":"HEAD SET - RAMP HANDLING, MODEL H10-13HX","Condition":"New","UOM":"EA"}]',
    missingItemsJson: null,
    lookupErrorsJson: null,
    requestedCount: 4,
    foundCount: 4,
    missingCount: 0,
    quotationName: 'SAL-QTN-2025-00019',
    quotationCreatedUtc: '2025-11-21T14:43:56.211',
    createdAt: '2025-11-21T14:43:10.032',
    updatedAt: '2025-11-21T14:43:56.211'
  },
  'E-20251115-cf4049c5380e-mouazabdelsamad': {
    id: 2,
    correlationId: 'E-20251115-cf4049c5380e-mouazabdelsamad',
    requesterEmail: 'mouaz.abdelsamad@outlook.com',
    customerName: null,
    requestedItemsJson: '[{"PartNumber":"89-01-07127","Quantity":5,"Description":"HANDSET","Condition":null,"UOM":null},{"PartNumber":"1027-2-011-8088","Quantity":1,"Description":"SEAT BELT","Condition":null,"UOM":null},{"PartNumber":"64300-212","Quantity":2,"Description":"CABLE ASSEMBLY","Condition":null,"UOM":null}]',
    foundItemsJson: null,
    missingItemsJson: '[{"PartNumber":"89-01-07127","Quantity":5,"Description":"HANDSET"},{"PartNumber":"1027-2-011-8088","Quantity":1,"Description":"SEAT BELT"},{"PartNumber":"64300-212","Quantity":2,"Description":"CABLE ASSEMBLY"}]',
    lookupErrorsJson: null,
    requestedCount: 3,
    foundCount: 0,
    missingCount: 3,
    quotationName: null,
    quotationCreatedUtc: null,
    createdAt: '2025-11-15T11:33:20.401',
    updatedAt: '2025-11-15T11:33:23.922'
  }
};
// Static PO States
export const STATIC_PO_STATES: {
  [correlationId: string]: PoStateDto;
} = {
  'E-20251121-79420988a318-mouazabdelsamad': {
    id: 3,
    correlationId: 'E-20251121-79420988a318-mouazabdelsamad',
    requesterEmail: 'mouaz.abdelsamad@outlook.com',
    customerName: 'Mouaz Abdelsamad Tech',
    poNumber: 'BQ25-A104C',
    requestedItemsJson: '[{"UnitPrice":5000,"TotalPrice":50000,"PartNumber":"NAS1611-01","Quantity":10,"Description":"O Ring Hyd"},{"UnitPrice":1500,"TotalPrice":1500,"PartNumber":"RCCB","Quantity":1,"Description":"RCCB"},{"UnitPrice":3000,"TotalPrice":300000,"PartNumber":"TS212-8","Quantity":100,"Description":"BITS TRI-WING #8"}]',
    orderedItemsJson: '[{"UnitPrice":1500.0,"TotalPrice":1500.0,"PartNumber":"RCCB PN: 84354350 CON: NEW","Quantity":1,"Description":"RCCB"},{"UnitPrice":2000.0,"TotalPrice":200000.0,"PartNumber":"TOOL PN: TS212-8","Quantity":100,"Description":"BITS TRI-WING #8"}]',
    missingItemsJson: '[{"PartNumber":"NAS1611-01","Quantity":10,"Description":"O Ring Hyd"}]',
    lookupErrorsJson: null,
    requestedCount: 3,
    orderedCount: 2,
    missingCount: 1,
    salesOrderNumber: 'SAL-ORD-2025-00021',
    salesOrderCreatedUtc: '2025-11-21T16:01:18.174',
    createdAt: '2025-11-21T15:53:34.07',
    updatedAt: '2025-11-21T16:01:18.174'
  },
  'E-20251121-9f44c8719dee-mouazabdelsamad': {
    id: 4,
    correlationId: 'E-20251121-9f44c8719dee-mouazabdelsamad',
    requesterEmail: 'mouaz.abdelsamad@outlook.com',
    customerName: 'Mouaz Abdelsamad Tech',
    poNumber: 'PO-2025-11-001',
    requestedItemsJson: '[{"UnitPrice":2500,"TotalPrice":25000,"PartNumber":"MS28775-115","Quantity":10,"Description":"PACKING PREFORMED"},{"UnitPrice":8000,"TotalPrice":16000,"PartNumber":"NAS1149F0832P","Quantity":2,"Description":"WASHER FLAT"},{"UnitPrice":1200,"TotalPrice":6000,"PartNumber":"AN960-416","Quantity":5,"Description":"WASHER FLAT"}]',
    orderedItemsJson: null,
    missingItemsJson: '[{"PartNumber":"MS28775-115","Quantity":10,"Description":"PACKING PREFORMED"},{"PartNumber":"NAS1149F0832P","Quantity":2,"Description":"WASHER FLAT"},{"PartNumber":"AN960-416","Quantity":5,"Description":"WASHER FLAT"}]',
    lookupErrorsJson: null,
    requestedCount: 3,
    orderedCount: 0,
    missingCount: 3,
    salesOrderNumber: null,
    salesOrderCreatedUtc: null,
    createdAt: '2025-11-21T11:36:47.701',
    updatedAt: '2025-11-21T11:46:13.478'
  }
};