-- ==============================================================================
-- WEDDING COMMAND CENTER - SEED DATA (PHASE 1)
-- FAKE SEED DATA ONLY: 3 Functions, 12 Households, 35 Guests, Vendors, Payments
-- (No real names, phone numbers, or addresses)
-- ==============================================================================

DO $$
DECLARE
  -- Functions
  fn_sangeet_id UUID := gen_random_uuid();
  fn_wedding_id UUID := gen_random_uuid();
  fn_reception_id UUID := gen_random_uuid();

  -- Households
  h1 UUID := gen_random_uuid();
  h2 UUID := gen_random_uuid();
  h3 UUID := gen_random_uuid();
  h4 UUID := gen_random_uuid();
  h5 UUID := gen_random_uuid();
  h6 UUID := gen_random_uuid();
  h7 UUID := gen_random_uuid();
  h8 UUID := gen_random_uuid();
  h9 UUID := gen_random_uuid();
  h10 UUID := gen_random_uuid();
  h11 UUID := gen_random_uuid();
  h12 UUID := gen_random_uuid();

  -- Vendors
  v_caterer UUID := gen_random_uuid();
  v_decorator UUID := gen_random_uuid();
  v_dj UUID := gen_random_uuid();

  -- Guest IDs
  g_id UUID;
BEGIN
  -- 1. INSERT FUNCTIONS
  INSERT INTO public.functions (id, name, date, venue, notes, accent_key, sort_order) VALUES
    (fn_sangeet_id, 'Sangeet & Garba Night', '2026-12-10', 'Grand Crystal Lawn, Borivali', 'Garba, performances, and dinner', 'lavender', 1),
    (fn_wedding_id, 'Wedding Ceremony', '2026-12-11', 'Shree Ambaji Mandir Hall', 'Baraat 9:30 AM, Hastamelap 11:15 AM', 'peach', 2),
    (fn_reception_id, 'Reception Dinner', '2026-12-12', 'Royal Orchid Banquet, Andheri', 'Cocktails and reception gala', 'sage-light', 3);

  -- 2. INSERT HOUSEHOLDS
  INSERT INTO public.households (id, name, city, area, address_note) VALUES
    (h1, 'Kishore & Bhavna Shah', 'Mumbai', 'Borivali West', 'A-302 Shanti Dham, Near Shimpoli'),
    (h2, 'Hitesh & Gita Patel', 'Mumbai', 'Kandivali East', '104 Gokul Heights, Thakur Village'),
    (h3, 'Dilip & Meena Mehta', 'Ahmedabad', 'Navrangpura', '12 Nilkanth Society, Near Stadium'),
    (h4, 'Rajesh & Suman Sharma', 'Mumbai', 'Goregaon East', 'B-1204 Oberoi Woods'),
    (h5, 'Nitin & Smita Desai', 'Vadodara', 'Alkapuri', '5/A Surya Nagar, Race Course'),
    (h6, 'Pravin & Alka Joshi', 'Surat', 'Adajan', '702 Platinum Tower, Pal Road'),
    (h7, 'Mahesh & Jyoti Trivedi', 'Rajkot', 'Kalawad Road', 'Bungalow 9, Pushkar Dham'),
    (h8, 'Suresh & Hansa Vora', 'Mumbai', 'Malad West', '401 Sunrise Apts, Link Road'),
    (h9, 'Ashok & Rekha Parekh', 'Ahmedabad', 'Satellite', 'B-403 Indraprastha, Jodhpur Cross Road'),
    (h10, 'Ketan & Neha Doshi', 'Mumbai', 'Vile Parle East', '15 Madhuvan, Nehru Road'),
    (h11, 'Sunil & Vandana Bhatt', 'Vadodara', 'Manjalpur', 'C-101 Royal Residency'),
    (h12, 'Pankaj & Geeta Modi', 'Surat', 'Ghud Dod Road', '804 Riverview Apartments');

  -- 3. INSERT GUESTS (35 individual attendees)
  -- Household 1 (Shah - 4 members)
  INSERT INTO public.guests (household_id, full_name, phone, city, notes) VALUES
    (h1, 'Kishore Shah', '+91 98200 00001', 'Mumbai', 'Uncle'),
    (h1, 'Bhavna Shah', '+91 98200 00002', 'Mumbai', 'Aunt'),
    (h1, 'Rohan Shah', '+91 98200 00003', 'Mumbai', 'Cousin'),
    (h1, 'Ananya Shah', '+91 98200 00004', 'Mumbai', 'Cousin');

  -- Household 2 (Patel - 3 members)
  INSERT INTO public.guests (household_id, full_name, phone, city, notes) VALUES
    (h2, 'Hitesh Patel', '+91 98200 00005', 'Mumbai', 'Family friend'),
    (h2, 'Gita Patel', '+91 98200 00006', 'Mumbai', NULL),
    (h2, 'Parth Patel', '+91 98200 00007', 'Mumbai', 'College friend of groom');

  -- Household 3 (Mehta - 3 members)
  INSERT INTO public.guests (household_id, full_name, phone, city, notes) VALUES
    (h3, 'Dilip Mehta', '+91 98200 00008', 'Ahmedabad', 'Mama'),
    (h3, 'Meena Mehta', '+91 98200 00009', 'Ahmedabad', 'Mami'),
    (h3, 'Khushboo Mehta', '+91 98200 00010', 'Ahmedabad', 'Cousin');

  -- Household 4 (Sharma - 3 members)
  INSERT INTO public.guests (household_id, full_name, phone, city, notes) VALUES
    (h4, 'Rajesh Sharma', '+91 98200 00011', 'Mumbai', 'Colleague of father'),
    (h4, 'Suman Sharma', '+91 98200 00012', 'Mumbai', NULL),
    (h4, 'Amit Sharma', '+91 98200 00013', 'Mumbai', NULL);

  -- Household 5 (Desai - 3 members)
  INSERT INTO public.guests (household_id, full_name, phone, city, notes) VALUES
    (h5, 'Nitin Desai', '+91 98200 00014', 'Vadodara', 'Masa'),
    (h5, 'Smita Desai', '+91 98200 00015', 'Vadodara', 'Masi'),
    (h5, 'Pooja Desai', '+91 98200 00016', 'Vadodara', 'Cousin');

  -- Household 6 (Joshi - 3 members)
  INSERT INTO public.guests (household_id, full_name, phone, city, notes) VALUES
    (h6, 'Pravin Joshi', '+91 98200 00017', 'Surat', 'Kaka'),
    (h6, 'Alka Joshi', '+91 98200 00018', 'Surat', 'Kaki'),
    (h6, 'Deep Joshi', '+91 98200 00019', 'Surat', 'Cousin');

  -- Household 7 (Trivedi - 3 members)
  INSERT INTO public.guests (household_id, full_name, phone, city, notes) VALUES
    (h7, 'Mahesh Trivedi', '+91 98200 00020', 'Rajkot', 'Senior relative'),
    (h7, 'Jyoti Trivedi', '+91 98200 00021', 'Rajkot', NULL),
    (h7, 'Karan Trivedi', '+91 98200 00022', 'Rajkot', NULL);

  -- Household 8 (Vora - 3 members)
  INSERT INTO public.guests (household_id, full_name, phone, city, notes) VALUES
    (h8, 'Suresh Vora', '+91 98200 00023', 'Mumbai', 'Neighbor'),
    (h8, 'Hansa Vora', '+91 98200 00024', 'Mumbai', NULL),
    (h8, 'Bhavik Vora', '+91 98200 00025', 'Mumbai', NULL);

  -- Household 9 (Parekh - 3 members)
  INSERT INTO public.guests (household_id, full_name, phone, city, notes) VALUES
    (h9, 'Ashok Parekh', '+91 98200 00026', 'Ahmedabad', 'Fua'),
    (h9, 'Rekha Parekh', '+91 98200 00027', 'Ahmedabad', 'Foi'),
    (h9, 'Tanvi Parekh', '+91 98200 00028', 'Ahmedabad', 'Cousin');

  -- Household 10 (Doshi - 3 members)
  INSERT INTO public.guests (household_id, full_name, phone, city, notes) VALUES
    (h10, 'Ketan Doshi', '+91 98200 00029', 'Mumbai', 'Business friend'),
    (h10, 'Neha Doshi', '+91 98200 00030', 'Mumbai', NULL),
    (h10, 'Aayush Doshi', '+91 98200 00031', 'Mumbai', NULL);

  -- Household 11 (Bhatt - 2 members)
  INSERT INTO public.guests (household_id, full_name, phone, city, notes) VALUES
    (h11, 'Sunil Bhatt', '+91 98200 00032', 'Vadodara', 'Family astrologer / Panditji'),
    (h11, 'Vandana Bhatt', '+91 98200 00033', 'Vadodara', NULL);

  -- Household 12 (Modi - 2 members)
  INSERT INTO public.guests (household_id, full_name, phone, city, notes) VALUES
    (h12, 'Pankaj Modi', '+91 98200 00034', 'Surat', 'Distant relative'),
    (h12, 'Geeta Modi', '+91 98200 00035', 'Surat', NULL);

  -- 4. LINK GUESTS TO FUNCTIONS (function_guests)
  -- Invite everyone to the Wedding Ceremony
  INSERT INTO public.function_guests (guest_id, function_id, invitation_status, rsvp_status)
  SELECT g.id, fn_wedding_id, 'invited',
    CASE 
      WHEN g.city = 'Mumbai' THEN 'confirmed'
      WHEN g.city IN ('Ahmedabad', 'Vadodara') THEN 'unknown'
      ELSE 'invited'
    END
  FROM public.guests g;

  -- Invite close family & friends to Sangeet
  INSERT INTO public.function_guests (guest_id, function_id, invitation_status, rsvp_status)
  SELECT g.id, fn_sangeet_id, 'invited',
    CASE 
      WHEN g.notes ILIKE '%Cousin%' THEN 'confirmed'
      WHEN g.city = 'Mumbai' THEN 'confirmed'
      ELSE 'unknown'
    END
  FROM public.guests g
  WHERE g.household_id IN (h1, h2, h3, h5, h6, h9);

  -- Invite Mumbai & nearby to Reception
  INSERT INTO public.function_guests (guest_id, function_id, invitation_status, rsvp_status)
  SELECT g.id, fn_reception_id, 'invited',
    CASE 
      WHEN g.city = 'Mumbai' THEN 'confirmed'
      ELSE 'invited'
    END
  FROM public.guests g
  WHERE g.household_id IN (h1, h2, h4, h8, h10, h3, h9);

  -- 5. UPDATE KANKOTRI VISITS WITH REALISTIC PROGRESS
  -- Update some households as delivered, some revisit, rest remain not_visited
  UPDATE public.kankotri_visits SET status = 'delivered', visited_on = NOW() - INTERVAL '3 days', note = 'Delivered in person. Very happy.' WHERE household_id IN (h1, h2, h4, h8);
  UPDATE public.kankotri_visits SET status = 'needs_revisit', note = 'Door locked, call before going next Sunday' WHERE household_id = h10;
  UPDATE public.kankotri_visits SET status = 'delivered', visited_on = NOW() - INTERVAL '1 day', note = 'Couried to Ahmedabad branch' WHERE household_id IN (h3, h9);

  -- 6. INSERT VENDORS
  INSERT INTO public.vendors (id, name, category, phone, notes) VALUES
    (v_caterer, 'Maharaja Caterers', 'Catering', '+91 98111 11111', 'Kathiyawadi & Gujarati menu for Sangeet, Royal Buffet for Reception'),
    (v_decorator, 'Floral Dreams Decor', 'Decorator', '+91 98222 22222', 'Mandap pastel florals and stage lighting'),
    (v_dj, 'DJ Harshil Sound', 'Sound & DJ', '+91 98333 33333', 'Sound system, fog machine, Sangeet tracks');

  -- 7. INSERT PAYMENTS (Values in integer paise: ₹1 = 100 paise)
  INSERT INTO public.payments (function_id, vendor_id, payee_text, title, amount_paise, paid_on, status, notes) VALUES
    -- Sangeet: ₹25,000 to DJ (advance) -> 2500000 paise
    (fn_sangeet_id, v_dj, 'DJ Harshil', 'DJ Advance Booking', 2500000, CURRENT_DATE - INTERVAL '14 days', 'advance', 'Advance for sound setup'),
    -- Sangeet: ₹75,000 to Decorator (advance) -> 7500000 paise
    (fn_sangeet_id, v_decorator, 'Floral Dreams Decor', 'Sangeet Stage & Lighting Advance', 7500000, CURRENT_DATE - INTERVAL '10 days', 'advance', '50% stage decoration advance'),
    -- Wedding: ₹1,50,000 to Caterer -> 15000000 paise
    (fn_wedding_id, v_caterer, 'Maharaja Caterers', 'Mandap Lunch Booking Token', 15000000, CURRENT_DATE - INTERVAL '7 days', 'paid', 'Initial deposit for 350 pax feast'),
    -- Reception: ₹45,000 for floral setup -> 4500000 paise
    (fn_reception_id, v_decorator, 'Floral Dreams Decor', 'Reception Entrance Arch Deposit', 4500000, CURRENT_DATE - INTERVAL '2 days', 'paid', 'Pastel floral arch frame deposit');

END $$;
