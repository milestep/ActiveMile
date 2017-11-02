class AddRegistersCount < ActiveRecord::Migration[5.0]
  def self.up
    add_column :counterparties, :registers_count, :integer, :default => 0
    
    Counterparty.reset_column_information
    Counterparty.all.each { |r| Counterparty.update(r.id, :registers_count => r.registers.length) }
  end

  def self.down
    remove_column :counterparties, :registers_count
  end
end
