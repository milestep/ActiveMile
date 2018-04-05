class User < ApplicationRecord
  has_secure_password

  has_many     :inventory_items

  validates    :email, presence: true
  validates    :email, uniqueness: true, if: :email
end
