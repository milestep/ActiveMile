class Api::V1::ReportsController < Api::V1::BaseController
  def index
    props = {
      years: params[:year],
      months: params[:month]
    }

    registers = Register.extract_by_date(props).includes(:article, :counterparty)

    registers = registers.group_by { |register| register[:date].strftime('%Y %m') }
    registers.each_pair do |key, value|
      registers[key] = registers[key].group_by { |register| register.article ?
        register.article.type : nil }
      end

    registers.each_pair do |key, value|
      registers[key].each_pair do |k, v|
        registers[key][k] = registers[key][k].group_by { |register| register.article ? register.article.title : nil }
      end
    end

    registers.each_pair do |key, value|
      registers[key].each_pair do |k, v|
        registers[key][k].each_pair do |k1, v1|
          registers[key][k][k1] = registers[key][k][k1].group_by { |register| register.counterparty ? register.counterparty.name : nil }
        end
      end
    end

    registers.each_pair do |key, value|
      registers[key].each_pair do |k, v|
        registers[key][k].each_pair do |k1, v1|
          value = 0
          registers[key][k][k1].each_pair do |k2, v2|
            registers[key][k][k1][k2].each do |item|
              value += item.value
            end
          end
           registers[key][k][k1][:value] = value
        end
      end
    end

    registers.each_pair do |key, value|
      registers[key].each_pair do |k, v|
        total = 0
        registers[key][k].each_pair do |k1, v1|
          total +=  registers[key][k][k1][:value]
        end
        registers[key][k][:total] = total
      end
    end

    registers.each_pair do |key, value|
      revenue = registers[key]['Revenue'] ? registers[key]['Revenue'][:total] : 0
      cost = registers[key]['Cost'] ? registers[key]['Cost'][:total] : 0
      profit = revenue - cost
      registers[key][:profit] = profit
    end

    render json: registers, status: 200
  end
end

