FactoryGirl.define do
  factory :workspace do
    title { Faker::App.name }
  end
end
