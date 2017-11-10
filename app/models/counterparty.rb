class Counterparty < ApplicationRecord
  self.inheritance_column = nil
  has_many :registers

  belongs_to :workspace

  validates :name, :date, :type, :workspace_id, presence: true
  validates :type, acceptance: { accept: ['Client', 'Vendor' , 'Other'] }

  before_destroy :registers_presence

  private
  
  def registers_presence
    throw(:abort) if registers_count.positive?
  end
end
