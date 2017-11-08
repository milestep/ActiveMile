class Counterparty < ApplicationRecord
  self.inheritance_column = nil
  has_many :registers

  belongs_to :workspace

  validates :name, :date, :type, :workspace_id, presence: true
  validates :type, acceptance: { accept: ['Client', 'Vendor' , 'Other'] }

  before_destroy :check_quantity_of_registers

  private
  def check_quantity_of_registers
    if self.registers_count > 0 
      throw :abort
    end
  end
end
