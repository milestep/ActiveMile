require 'rails_helper'

RSpec.describe Counterparty, type: :model do
  context 'validation all' do
    subject { build(:counterparty) }

    context 'validations should' do
      it { should be_valid(:name) }
      it { should be_valid(:date) }
      it { should be_valid(:type) }
      it { should be_valid(:workspace_id) }
    end

    context 'validation expect' do
      let(:counterparty) { build(:counterparty) }

      it 'expect be valid' do
        expect(counterparty).to be_valid
      end

      it 'expect require name' do
        counterparty.name = nil
        expect(counterparty).not_to be_valid
        expect(counterparty).to have(1).error_on(:name)
      end

      it 'expect require date' do
        counterparty.date = nil
        expect(counterparty).not_to be_valid
        expect(counterparty).to have(1).error_on(:date)
      end

      it 'expect require type' do
        counterparty.type = nil
        expect(counterparty).not_to be_valid
        expect(counterparty).to have(1).error_on(:type)
      end

      it 'expect require workspace_id' do
        counterparty.workspace_id = nil
        expect(counterparty).not_to be_valid
        expect(counterparty).to have(1).error_on(:workspace_id)
      end
    end
  end
end
