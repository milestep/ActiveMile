task registers_count: :environment do
  Counterparty.find_each{ |counterparty| Counterparty.reset_counters(counterparty.id, :registers) }
end