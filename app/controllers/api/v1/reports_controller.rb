class Api::V1::ReportsController < Api::V1::BaseController
  skip_before_action :doorkeeper_authorize!

  expose :registers, -> { current_workspace.registers }

  def index
    reports = {
      Revenue: {
        Jan: [],
        Feb: [],
        Mar: [],
        Apr: [],
        May: [],
        Jun: [],
        Jul: [],
        Aug: [],
        Sep: [],
        Oct: [],
        Nov: [],
        Dec: []
      },
      Cost: {
        Jan: [],
        Feb: [],
        Mar: [],
        Apr: [],
        May: [],
        Jun: [],
        Jul: [],
        Aug: [],
        Sep: [],
        Oct: [],
        Nov: [],
        Dec: []
      }
     }

     sum = {
       Jan: {
         Revenue: 0,
         Cost: 0
       },
       Feb: {
         Revenue: 0,
         Cost: 0
       },
       Mar: {
         Revenue: 0,
         Cost: 0
       },
       Apr: {
         Revenue: 0,
         Cost: 0
       },
       May: {
         Revenue: 0,
         Cost: 0
       },
       Jun: {
         Revenue: 0,
         Cost: 0
       },
       Jul: {
         Revenue: 0,
         Cost: 0
       },
       Aug: {
         Revenue: 0,
         Cost: 0
       },
       Sep: {
         Revenue: 0,
         Cost: 0
       },
       Oct: {
         Revenue: 0,
         Cost: 0
       },
       Nov: {
         Revenue: 0,
         Cost: 0
       },
       Dec: {
         Revenue: 0,
         Cost: 0
       }
     }

    financial_result = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0
    }

    Register.all.each do |register|
      article = register.article
      counterparty = register.counterparty
      date = register.date
      report_month = date.strftime("%b")
      data = reports[article.type.to_sym][report_month.to_sym]
      find_article = data.find { |x| x[:article].id === article.id }
      find_month = data.find { |x| x[:date] === report_month }
      sum[report_month.to_sym][article.type.to_sym] += register.value
      total_revenue = sum[report_month.to_sym][:Revenue]
      total_cost = sum[report_month.to_sym][:Cost]
      financial_result[report_month.to_sym] = total_revenue - total_cost

      if find_article
        find_article[:value] += register.value

        if find_article[:counterparties].present?
          counterparty_find = find_article[:counterparties].find { |x|
            if counterparty === nil
              if x[:counterparty] === nil
                true
              else
                false
              end
            else
              x[:counterparty] === counterparty
            end
          }

          if counterparty_find
            counterparty_find[:value] += register.value
          else
            counterparty_change = counterparty || nil
            find_article[:counterparties].push({
              counterparty: counterparty_change,
              value: register.value
            })
          end
        end
      else
        counterparty_change = counterparty || nil
        data.push({
          article: article,
          value: register.value,
          date: report_month,
          counterparties: [{
            counterparty: counterparty_change,
            value: register.value
          }]
        })
      end
    end

    render json: { reports: reports, sum: sum, result: financial_result }, status: 200
  end
end

