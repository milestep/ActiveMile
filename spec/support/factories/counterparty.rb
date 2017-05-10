FactoryGirl.define do
  factory :counterparty do
    name          { Faker::App.name }
    date          { Faker::Date.between(2.days.ago, Date.today) }
    type          { Faker::Name.name }
    workspace_id  { Faker::Number.number(1) }
  end
end
