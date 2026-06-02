import type { DataRow, Profile } from './types';

export const demoProfile: Profile = {
  id: 'demo-admin',
  username: 'admin',
  full_name: 'Farm Administrator',
  role: 'admin',
  email: 'admin@piggery.local',
  status: 'active',
};

export const mockTables: Record<string, DataRow[]> = {
  profiles: [demoProfile],
  pig_breeds: [
    { id: 1, breed_name: 'Landrace', description: 'Excellent mothering ability.', avg_gestation_days: 114, avg_litter_size: 12 },
    { id: 2, breed_name: 'Large White', description: 'Good feed conversion.', avg_gestation_days: 115, avg_litter_size: 11 },
    { id: 3, breed_name: 'Duroc', description: 'Fast growth rate.', avg_gestation_days: 114, avg_litter_size: 9 },
  ],
  pens: [
    { id: 1, pen_number: 'PEN-001', pen_type: 'farrowing', capacity: 5, current_count: 2, status: 'active', description: 'Farrowing crates' },
    { id: 2, pen_number: 'PEN-002', pen_type: 'nursery', capacity: 30, current_count: 0, status: 'active', description: 'Piglets' },
    { id: 3, pen_number: 'PEN-003', pen_type: 'grower', capacity: 20, current_count: 2, status: 'active', description: 'Growers' },
    { id: 4, pen_number: 'PEN-004', pen_type: 'finisher', capacity: 20, current_count: 2, status: 'active', description: 'Finishers' },
  ],
  pigs: [
    { id: 1, pig_tag: 'SOW-001', breed_id: 1, gender: 'female', pig_type: 'sow', pen_id: 1, date_of_birth: '2022-03-15', source: 'purchased', current_weight: 180.5, status: 'active' },
    { id: 2, pig_tag: 'SOW-002', breed_id: 2, gender: 'female', pig_type: 'sow', pen_id: 1, date_of_birth: '2022-05-20', source: 'born_on_farm', current_weight: 165, status: 'active' },
    { id: 3, pig_tag: 'BOAR-001', breed_id: 3, gender: 'male', pig_type: 'boar', pen_id: 4, date_of_birth: '2021-11-10', source: 'purchased', current_weight: 250, status: 'active' },
    { id: 4, pig_tag: 'GRW-001', breed_id: 2, gender: 'male', pig_type: 'grower', pen_id: 3, date_of_birth: '2025-12-10', source: 'born_on_farm', current_weight: 45, status: 'active' },
    { id: 5, pig_tag: 'FIN-001', breed_id: 1, gender: 'male', pig_type: 'finisher', pen_id: 4, date_of_birth: '2025-09-05', source: 'born_on_farm', current_weight: 95, status: 'active' },
  ],
  feed_types: [
    { id: 1, feed_name: 'Starter Mash', feed_category: 'starter', brand: 'UFC', protein_percent: 22, price_per_kg: 45, status: 'active' },
    { id: 2, feed_name: 'Grower Pellet', feed_category: 'grower', brand: 'UFC', protein_percent: 18, price_per_kg: 38, status: 'active' },
    { id: 3, feed_name: 'Finisher Pellet', feed_category: 'finisher', brand: 'UFC', protein_percent: 16, price_per_kg: 35, status: 'active' },
  ],
  feed_inventory: [
    { id: 1, feed_type_id: 1, quantity_kg: 200, minimum_stock_kg: 50, last_restocked: '2026-05-20' },
    { id: 2, feed_type_id: 2, quantity_kg: 80, minimum_stock_kg: 100, last_restocked: '2026-05-18' },
    { id: 3, feed_type_id: 3, quantity_kg: 400, minimum_stock_kg: 100, last_restocked: '2026-05-16' },
  ],
  feeding_records: [
    { id: 1, pen_id: 3, feed_type_id: 2, feeding_date: '2026-05-23', feeding_time: 'morning', quantity_kg: 12 },
  ],
  weight_records: [
    { id: 1, pig_id: 4, weight_kg: 45, recorded_date: '2026-05-20', age_days: 162 },
  ],
  health_records: [
    { id: 1, pig_id: 4, record_type: 'deworming', health_date: '2026-05-10', medicine_name: 'Ivermectin', route: 'injection', next_due_date: '2026-08-10', cost: 150 },
  ],
  breeding_records: [
    { id: 1, sow_id: 1, boar_id: 3, breeding_date: '2026-05-01', expected_farrowing: '2026-08-23', status: 'bred', breeding_type: 'natural' },
  ],
  mortality_records: [],
  sales_records: [
    { id: 1, sale_date: '2026-05-15', pig_id: 5, sale_type: 'live_weight', buyer_name: 'Local Buyer', live_weight_kg: 95, price_per_kg: 180, total_amount: 17100, payment_status: 'paid', amount_paid: 17100 },
  ],
  expenses: [
    { id: 1, expense_date: '2026-05-18', category: 'feed', description: 'Grower feed restock', amount: 7600, vendor: 'Feed Store' },
    { id: 2, expense_date: '2026-05-10', category: 'medicine', description: 'Deworming medicine', amount: 150, vendor: 'Vet Supply' },
  ],
  tasks: [
    { id: 1, task_title: 'Check grower pen feed stock', task_type: 'feeding', due_date: '2026-05-25', priority: 'high', status: 'pending', assigned_to: 'demo-admin' },
    { id: 2, task_title: 'Prepare farrowing pen', task_type: 'breeding', due_date: '2026-08-18', priority: 'medium', status: 'pending', assigned_to: 'demo-admin' },
  ],
};
