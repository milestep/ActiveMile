require 'rails_helper'

RSpec.describe HolidaysItem, type: :model do
  describe 'validation all' do
    subject { build(:holiday_item) }

    context 'validations should be valid' do
      it { should be_valid(:name) }
      it { should be_valid(:date) }
    end
  end
end
