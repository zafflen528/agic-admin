-- Sample leads for local development. Run AFTER schema.sql.
-- Dates are relative to now(), so "New this week" on the Dashboard is always non-zero.
-- Safe to re-run: the delete below clears previous seed rows first.
--
-- Do NOT run this against production.

delete from inquiries where email like '%@example.com';

insert into inquiries (name, company, email, phone, product, message, status, created_at) values
  ('Budi Santoso', 'PT Nusantara Energi', 'budi.santoso@example.com', '+62 811 2345 6789',
   'Coal GAR 58', 'Looking for 50,000 MT monthly, FOB Samarinda. Please send your latest price and laycan availability.',
   'New', now() - interval '6 hours'),

  ('Mei Ling Tan', 'Sinar Pacific Trading', 'meiling.tan@example.com', '+65 8123 4567',
   'Coal GAR 48', 'Buyer in Singapore. Need spec sheet and a recent COA before we proceed to LOI.',
   'New', now() - interval '2 days'),

  ('Rizky Pratama', 'CV Bara Mandiri', 'rizky.pratama@example.com', '+62 812 9988 7766',
   'Coal GAR 45', 'Trial cargo 8,000 MT for a cement plant in Gresik. What is the minimum order quantity?',
   'New', now() - interval '4 days'),

  ('Anand Kumar', 'Bharat Coal Imports Pvt Ltd', 'anand.kumar@example.com', '+91 98200 11223',
   'Coal GAR 58', 'Requesting CFR Krishnapatnam quote for 55,000 MT, shipment next quarter.',
   'Contacted', now() - interval '9 days'),

  ('Siti Nurhaliza', 'PT Karya Bakti Utama', 'siti.nurhaliza@example.com', '+62 813 4455 6677',
   'Coal GAR 48', 'Following up on our call — can you confirm sulphur is under 0.8% ADB?',
   'Contacted', now() - interval '13 days'),

  ('Nguyen Van Minh', 'Vinh Phat Import Export', 'nguyen.minh@example.com', '+84 90 123 4567',
   'Coal GAR 45', 'Interested in a 12-month term contract. Who should we address the LOI to?',
   'Contacted', now() - interval '17 days'),

  ('Dewi Lestari', 'PT Zata Eksporia Nusantara', 'dewi.lestari@example.com', '+62 815 2233 4455',
   'Coal GAR 58', 'Quote received, forwarding to our principal for approval. Holding vessel nomination.',
   'Quoted', now() - interval '21 days'),

  ('Chen Wei', 'Guangzhou Hengli Resources', 'chen.wei@example.com', '+86 138 0013 8000',
   'Coal GAR 48', 'Price is workable. Need to confirm barge schedule before signing.',
   'Quoted', now() - interval '26 days'),

  ('Ahmad Fauzi', NULL, 'ahmad.fauzi@example.com', '+62 878 1122 3344',
   'Coal GAR 45', 'Independent broker with a buyer in Medan. Are commissions available on closed deals?',
   'Quoted', now() - interval '33 days'),

  ('Hendra Wijaya', 'PT Samudra Logistik', 'hendra.wijaya@example.com', '+62 819 7788 9900',
   'Coal GAR 58', 'Contract signed, first shipment loaded. Thanks for the quick turnaround.',
   'Closed', now() - interval '41 days'),

  ('Laura Whitfield', 'Meridian Commodities Ltd', 'laura.whitfield@example.com', '+44 20 7946 0123',
   'Coal GAR 48', 'Went with another supplier this round — please keep us on your circular list.',
   'Closed', now() - interval '55 days'),

  ('Joko Purnomo', NULL, 'joko.purnomo@example.com', NULL,
   NULL, 'General enquiry from the website. What grades do you currently have available?',
   'New', now() - interval '1 day');
