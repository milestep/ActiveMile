require 'rails_helper'

RSpec.describe Counterparty, type: :model do
  context 'all' do
    subject { build(:counterparty) }

    context 'validations should' do
      it { should be_valid(:name) }
      it { should be_valid(:date) }
      it { should be_valid(:type) }
      it { should be_valid(:workspace_id) }
    end

    context 'associations should' do
      it { should belong_to(:workspace) }
      it { should have_many(:registers) }
      it { should have_many(:client_registers) }
      it { should have_many(:manager_registers) }
      it { should have_many(:inventory_items) }
    end

    context 'validations exepect' do
      let(:counterparty) { build(:counterparty) }

      it 'expect to be valid' do
        expect(counterparty).to be_valid
      end

      it 'expect to require a name' do
        counterparty.name = nil
        expect(counterparty).not_to be_valid
        expect(counterparty).to have(1).error_on(:name)
      end

      it 'expect to require a date' do
        counterparty.date = nil
        expect(counterparty).not_to be_valid
        expect(counterparty).to have(1).error_on(:date)
      end

      it 'expect to require a type' do
        counterparty.type = nil
        expect(counterparty).not_to be_valid
        expect(counterparty).to have(1).error_on(:type)
      end

      it 'expect type with sales to be not valid' do
        counterparty.workspace.feature.sales = false
        counterparty.type = 'Sales'
        expect(counterparty).not_to be_valid
        expect(counterparty).to have(1).error_on(:type)
      end

      it 'expect type with sales to be valid' do
        counterparty.workspace.feature.sales = true
        counterparty.type = 'Sales'
        expect(counterparty).to be_valid
      end
    end
  end
end
