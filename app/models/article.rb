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

  validates :title, :type, :workspace_id, presence: true
end
