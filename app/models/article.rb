class Article < ApplicationRecord
  module TYPES
    REVENUE = 'Revenue'
    COST = 'Cost'
  end

  TYPES.constants.each do |article_type|
    define_method("#{article_type.to_s.downcase}?") do
      type == article_type.to_s.capitalize
    end
  end

  belongs_to :workspace
  has_many :registers

  validates :title, :type, :workspace_id, presence: true

  before_destroy :article_associate_with_registers?

  def article_associate_with_registers?
    if registers_count.positive?
      errors.add(:registers, "could not be deleted due to associated registers")
      throw(:abort)
    end
  end
end
