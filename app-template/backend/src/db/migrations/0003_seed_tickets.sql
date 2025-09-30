-- Custom SQL migration file, put your code below! --

-- Insert 50 realistic ticket records
INSERT INTO tickets (subject, status, priority, requester_id, created_at, updated_at)
SELECT
  subjects.subject,
  statuses.status,
  priorities.priority,
  (SELECT id FROM users ORDER BY random() LIMIT 1) as requester_id,
  NOW() - (random() * interval '90 days') as created_at,
  NOW() - (random() * interval '30 days') as updated_at
FROM
  (VALUES
    ('Unable to login to account'),
    ('Payment processing error'),
    ('Product not received after 2 weeks'),
    ('Incorrect item shipped'),
    ('Account locked after multiple attempts'),
    ('Refund request for cancelled order'),
    ('Website displaying error on checkout'),
    ('Cannot update shipping address'),
    ('Promotional code not working'),
    ('Missing items from order'),
    ('Damaged product received'),
    ('Billing amount incorrect'),
    ('Need help resetting password'),
    ('Order status not updating'),
    ('Unable to track package'),
    ('Charged twice for same order'),
    ('Product quality issue'),
    ('Request to change order before shipping'),
    ('Email notifications not received'),
    ('Unable to apply gift card'),
    ('Account information update needed'),
    ('Subscription cancellation request'),
    ('Invoice not received'),
    ('Shipping delay inquiry'),
    ('Return label request'),
    ('Product size exchange needed'),
    ('Account merge request'),
    ('Credit card payment declined'),
    ('International shipping question'),
    ('Bulk order discount inquiry'),
    ('Product availability question'),
    ('Technical issue with mobile app'),
    ('Order cancellation request'),
    ('Request for product customization'),
    ('Shipping cost discrepancy'),
    ('Account closure request'),
    ('Gift wrapping not applied'),
    ('Loyalty points not credited'),
    ('Incorrect tax calculation'),
    ('Pre-order status inquiry'),
    ('Password reset email not received'),
    ('Unable to update payment method'),
    ('Product warranty claim'),
    ('Return status inquiry'),
    ('Delivery address verification'),
    ('Order modification request'),
    ('Coupon code expiration issue'),
    ('Account verification problem'),
    ('Payment method removal request'),
    ('Order confirmation not received')
  ) AS subjects(subject)
CROSS JOIN (
  SELECT status FROM (
    VALUES ('open'), ('open'), ('open'), ('open'), ('open'), ('open'), ('open'), ('open'),
           ('in_progress'), ('in_progress'), ('in_progress'), ('in_progress'), ('in_progress'),
           ('pending'), ('pending'), ('pending'),
           ('resolved'), ('resolved'), ('resolved'), ('resolved'),
           ('closed'), ('closed')
  ) AS s(status)
  ORDER BY random()
  LIMIT 1
) AS statuses
CROSS JOIN (
  SELECT priority FROM (
    VALUES ('low'), ('low'), ('low'), ('low'), ('low'), ('low'),
           ('medium'), ('medium'), ('medium'), ('medium'), ('medium'), ('medium'), ('medium'), ('medium'),
           ('high'), ('high'), ('high'), ('high'),
           ('urgent'), ('urgent')
  ) AS p(priority)
  ORDER BY random()
  LIMIT 1
) AS priorities
LIMIT 50;