<script setup lang="ts">
import BingoBoard from './BingoBoard.vue'
import GoalsTable from '@/components/goals-table/GoalsTable.vue'
import { columns } from '@/components/goals-table/columns.ts'

const data = [
    { id: '1',  amount: 100, status: 'pending', email: 'm@example.com' },
    { id: '2',  amount: 250, status: 'completed', email: 'alice@example.com' },
    { id: '3',  amount: 75, status: 'failed', email: 'bob@example.org' },
    { id: '4',  amount: 500, status: 'pending', email: 'carol@test.com' },
    { id: '5',  amount: 320, status: 'completed', email: 'dave@sample.net' },
    { id: '6',  amount: 430, status: 'canceled', email: 'eve@mail.com' },
    { id: '7',  amount: 150, status: 'pending', email: 'frank@demo.io' },
    { id: '8',  amount: 880, status: 'completed', email: 'grace@domain.com' },
    { id: '9',  amount: 60,  status: 'failed', email: 'heidi@website.org' },
    { id: '10', amount: 210, status: 'pending', email: 'ivan@test.net' },
    { id: '11', amount: 725, status: 'completed', email: 'judy@foo.com' },
    { id: '12', amount: 495, status: 'failed', email: 'karl@bar.org' },
    { id: '13', amount: 330, status: 'pending', email: 'lisa@baz.net' },
    { id: '14', amount: 660, status: 'completed', email: 'mike@example.io' },
    { id: '15', amount: 120, status: 'canceled', email: 'nina@test.org' },
    { id: '16', amount: 285, status: 'pending', email: 'oscar@demo.com' },
    { id: '17', amount: 950, status: 'completed', email: 'pat@domain.net' },
    { id: '18', amount: 45,  status: 'failed', email: 'quinn@mail.org' },
    { id: '19', amount: 510, status: 'pending', email: 'rachel@site.com' },
    { id: '20', amount: 775, status: 'completed', email: 'sam@web.net' },
    { id: '21', amount: 190, status: 'canceled', email: 'tina@info.io' },
    { id: '22', amount: 840, status: 'completed', email: 'uma@alpha.com' },
    { id: '23', amount: 305, status: 'failed', email: 'vince@beta.org' },
    { id: '24', amount: 670, status: 'pending', email: 'wendy@gamma.net' },
    { id: '25', amount: 1000,status: 'completed', email: 'xavier@delta.io' },
    { id: '26', amount: 80,  status: 'failed', email: 'yara@epsilon.com' },
    { id: '27', amount: 240, status: 'pending', email: 'zane@zeta.org' },
    { id: '28', amount: 390, status: 'completed', email: 'abby@theta.net' },
    { id: '29', amount: 125, status: 'canceled', email: 'ben@iota.io' },
    { id: '30', amount: 560, status: 'pending', email: 'claire@kappa.com' },
    { id: '31', amount: 340, status: 'completed', email: 'dan@lambda.org' },
    { id: '32', amount: 295, status: 'failed', email: 'ella@mu.net' },
    { id: '33', amount: 815, status: 'pending', email: 'finn@nu.io' },
    { id: '34', amount: 710, status: 'completed', email: 'gina@xi.com' },
    { id: '35', amount: 170, status: 'canceled', email: 'hank@omicron.org' },
    { id: '36', amount: 645, status: 'pending', email: 'iris@pi.net' },
    { id: '37', amount: 380, status: 'completed', email: 'jack@rho.io' },
    { id: '38', amount: 215, status: 'failed', email: 'kate@sigma.com' },
    { id: '39', amount: 910, status: 'pending', email: 'leo@tau.org' },
    { id: '40', amount: 185, status: 'completed', email: 'maya@upsilon.net' },
    { id: '41', amount: 275, status: 'canceled', email: 'nate@phi.io' },
    { id: '42', amount: 460, status: 'pending', email: 'olga@chi.com' },
    { id: '43', amount: 700, status: 'completed', email: 'paul@psi.org' },
    { id: '44', amount: 155, status: 'failed', email: 'quinn@omega.net' },
    { id: '45', amount: 525, status: 'pending', email: 'rose@alpha.io' },
    { id: '46', amount: 600, status: 'completed', email: 'steve@beta.com' },
    { id: '47', amount: 195, status: 'failed', email: 'toni@gamma.org' },
    { id: '48', amount: 835, status: 'pending', email: 'ursula@delta.net' },
    { id: '49', amount: 910, status: 'completed', email: 'victor@epsilon.io' },
    { id: '50', amount: 345, status: 'canceled', email: 'wanda@zeta.com' },
    { id: '51', amount: 480, status: 'pending', email: 'xena@theta.org' },
    { id: '52', amount: 620, status: 'completed', email: 'yuri@iota.net' },
    { id: '53', amount: 140, status: 'failed', email: 'zara@kappa.io' },
    { id: '54', amount: 765, status: 'pending', email: 'andy@lambda.com' },
    { id: '55', amount: 830, status: 'completed', email: 'bella@mu.org' },
    { id: '56', amount: 135, status: 'failed', email: 'carl@nu.net' },
    { id: '57', amount: 905, status: 'pending', email: 'dina@xi.io' },
    { id: '58', amount: 275, status: 'completed', email: 'eli@omicron.com' },
    { id: '59', amount: 165, status: 'canceled', email: 'faye@pi.org' },
    { id: '60', amount: 290, status: 'pending', email: 'gabe@rho.net' },
    { id: '61', amount: 455, status: 'completed', email: 'hope@sigma.io' },
    { id: '62', amount: 195, status: 'failed', email: 'ian@tau.com' },
    { id: '63', amount: 380, status: 'pending', email: 'jane@upsilon.org' },
    { id: '64', amount: 640, status: 'completed', email: 'kyle@phi.net' },
]
</script>

<template>
    <!--    <BingoBoard />-->
    <!--  TODO: Remove outer div and fix in layout-->
    <div class="m-20">
        <GoalsTable :data="data" :columns="columns" />
    </div>
</template>
