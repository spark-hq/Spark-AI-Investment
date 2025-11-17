-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('STOCK', 'MUTUAL_FUND', 'CRYPTO', 'ETF', 'BOND', 'GOLD', 'FD', 'PPF', 'NPS');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL', 'DIVIDEND', 'BONUS', 'SPLIT', 'MERGER');

-- CreateTable
CREATE TABLE "portfolios" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "totalInvested" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "currentValue" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "returns" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "returnsPercent" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments" (
    "id" UUID NOT NULL,
    "portfolio_id" UUID NOT NULL,
    "symbol" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "InvestmentType" NOT NULL,
    "platform" VARCHAR(100) NOT NULL,
    "sector" VARCHAR(100),
    "quantity" DECIMAL(15,6) NOT NULL,
    "avg_buy_price" DECIMAL(15,2) NOT NULL,
    "current_price" DECIMAL(15,2) NOT NULL,
    "invested_amount" DECIMAL(15,2) NOT NULL,
    "current_value" DECIMAL(15,2) NOT NULL,
    "returns" DECIMAL(15,2) NOT NULL,
    "returns_percent" DECIMAL(10,4) NOT NULL,
    "purchase_date" DATE NOT NULL,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "investment_id" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "quantity" DECIMAL(15,6) NOT NULL,
    "price" DECIMAL(15,2) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "charges" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "date" DATE NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portfolios_user_id_key" ON "portfolios"("user_id");

-- CreateIndex
CREATE INDEX "portfolios_user_id_idx" ON "portfolios"("user_id");

-- CreateIndex
CREATE INDEX "investments_portfolio_id_idx" ON "investments"("portfolio_id");

-- CreateIndex
CREATE INDEX "investments_symbol_idx" ON "investments"("symbol");

-- CreateIndex
CREATE INDEX "investments_type_idx" ON "investments"("type");

-- CreateIndex
CREATE INDEX "transactions_investment_id_idx" ON "transactions"("investment_id");

-- CreateIndex
CREATE INDEX "transactions_date_idx" ON "transactions"("date");

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_investment_id_fkey" FOREIGN KEY ("investment_id") REFERENCES "investments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
