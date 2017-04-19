class Article < ApplicationRecord
  self.inheritance_column = :_type_disabled

  enum type: [ :revenue, :cost, :translation, :loan ]

  belongs_to :workspace
  validates :title, presence: true
end
