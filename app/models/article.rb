class Article < ApplicationRecord
  belongs_to :workspace
  validates :title, presence: true
end
