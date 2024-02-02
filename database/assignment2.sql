-- Query # 4

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- Query # 6


UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'), inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');