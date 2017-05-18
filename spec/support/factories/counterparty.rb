FactoryGirl.define do
  factory :counterparty do
    name          { Faker::App.name }
    date          { Faker::Date.between(2.days.ago, Date.today) }
    type          { Faker::App.name }
    workspace     factory: :workspace
  end
end
