FactoryGirl.define do
  factory :inventory_item do
    name            { Faker::App.name }
    date            { Faker::Date.between(2.days.ago, Date.today) }
  end
end
