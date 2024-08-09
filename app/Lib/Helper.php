<?php

namespace App\Lib;

use DB;
use DateTime;
use Carbon\Carbon;
use App\Models\Stores;
use Illuminate\Support\Facades\Auth;

class Helper
{
    /**
     * @param int length of generated string
     * @return string Random string
     */
    public function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function getDatesOfQuarter($quarter = 'current', $year = null, $format = null)
    {
        if (!is_int($year)) {
            $year = (new DateTime)->format('Y');
        }
        $current_quarter = ceil((new DateTime)->format('n') / 3);
        switch (strtolower($quarter)) {
            case 'this':
            case 'current':
                $quarter = ceil((new DateTime)->format('n') / 3);
                break;

            case 'previous':
                $year = (new DateTime)->format('Y');
                if ($current_quarter == 1) {
                    $quarter = 4;
                    $year--;
                } else {
                    $quarter =  $current_quarter - 1;
                }
                break;

            case 'first':
                $quarter = 1;
                break;

            case 'last':
                $quarter = 4;
                break;

            default:
                $quarter = (!is_int($quarter) || $quarter < 1 || $quarter > 4) ? $current_quarter : $quarter;
                break;
        }
        if ($quarter === 'this') {
            $quarter = ceil((new DateTime)->format('n') / 3);
        }
        $start = new DateTime($year . '-' . (3 * $quarter - 2) . '-1 00:00:00');
        $end = new DateTime($year . '-' . (3 * $quarter) . '-' . ($quarter == 1 || $quarter == 4 ? 31 : 30) . ' 23:59:59');

        return array(
            'start' => $format ? $start->format($format) : $start,
            'end' => $format ? $end->format($format) : $end,
        );
    }

    public function getLabelStr($datefilter, $betweendates = false)
    {
        switch ($datefilter):
            case 'thisweek':
                $startweek = Carbon::now()->startOfWeek();
                $endweek = Carbon::now()->endOfWeek();
                $startdate = date('Y-m-d', strtotime($startweek));
                $enddate = date('Y-m-d', strtotime($endweek));
                break;
            case 'thismonth':
                $firstmonthdate = date('Y-m-01');
                $lastmonthdate = date('Y-m-d');
                $startdate = date('Y-m-d', strtotime($firstmonthdate));
                $enddate = date('Y-m-d', strtotime($lastmonthdate));
                break;
            case 'lastmonth':
                $firstmonthdate = Carbon::now()->subMonth()->startOfMonth();
                $lastmonthdate =  Carbon::now()->subMonth()->endOfMonth();
                $startdate = date('Y-m-d', strtotime($firstmonthdate));
                $enddate = date('Y-m-d', strtotime($lastmonthdate));
                break;
            case '7days':
                $sdate = Carbon::now()->subDays(7);
                $edate = Carbon::now()->subDays(1);
                $startdate = date('Y-m-d', strtotime($sdate));
                $enddate = date('Y-m-d', strtotime($edate));
                break;
            case '30days':
                $sdate = Carbon::now()->subDays(30);
                $edate = Carbon::now()->subDays(1);
                $startdate = date('Y-m-d', strtotime($sdate));
                $enddate = date('Y-m-d', strtotime($edate));
                break;
            case 'thisquarter':
                $dates = $this->getDatesOfQuarter('current', null, 'Y-m-d');
                $startdate = $dates['start'];
                $enddate = $dates['end'];
                break;
            case 'lastquarter':
                $dates = $this->getDatesOfQuarter('previous', null, 'Y-m-d');
                $startdate = $dates['start'];
                $enddate = $dates['end'];
                break;
            case 'last12months':
                $sdate = Carbon::now()->subYear();
                $edate = Carbon::now();
                $startdate = date('Y-m-d', strtotime($sdate));
                $enddate = date('Y-m-d', strtotime($edate));;
                break;
        endswitch;

        $betweendates = $this->getAllDateInBetween($startdate, $enddate);
        return ($betweendates) ? array('start' => $startdate, 'end' => $enddate, 'betweendates' => $betweendates) : $betweendates;
    }

    public function getAllDateInBetween($startdate, $enddate)
    {
        $rangeArray = [];

        $startdate = strtotime($startdate);
        $enddate = strtotime($enddate);

        for ($currentDate = $startdate; $currentDate <= $enddate; $currentDate += (86400)) {
            $date = date('Y-m-d', $currentDate);
            $rangeArray[] = $date;
        }

        return $rangeArray;
    }

    public function getFilterQuery($datefilter, $monthqry = null)
    {
        $wheretype = 'days';
        $wheremonth = ($monthqry != '') ? $monthqry : 'order_date';
        $wheremonthval = $whereclause = '';
        $wherestr = 'where';
        switch ($datefilter):
            case 'thismonth':
                $wherestr = 'whereBetween';
                $firstmonthdate = date('Y-m-01');
                $lastmonthdate = date('Y-m-t');
                $wheremonthval = [$firstmonthdate, $lastmonthdate];
                $wheretype = 'months';
                break;
            case '30days':
                $days30 = Carbon::now()->subDays(30);
                $whereclause = [[$wheremonth, '>=', $days30]];
                break;
            case 'lastmonth':
                $wherestr = 'whereBetween';
                $wheremonthval = [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()];
                $wheretype = 'months';
                break;
            case 'thisquarter':
                $dates = $this->getDatesOfQuarter('current', null, 'Y-m-d');
                $firstmonthdate = $dates['start'];
                $lastmonthdate = $dates['end'];
                $wheremonthval = [$firstmonthdate, $lastmonthdate];
                $wherestr = 'whereBetween';
                $wheretype = 'months';
                break;
            case 'lastquarter':
                $dates = $this->getDatesOfQuarter('previous', null, 'Y-m-d');
                $firstmonthdate = $dates['start'];
                $lastmonthdate = $dates['end'];
                $wheremonthval = [$firstmonthdate, $lastmonthdate];
                $wherestr = 'whereBetween';
                $wheretype = 'months';
                break;
            case 'last12months':
                $wherestr = 'whereBetween';
                $wheremonthval = [Carbon::now()->subYear(), Carbon::now()];
                $wheretype = 'months';
                break;
            case '7days':
                $days7 = Carbon::now()->subDays(7);
                $whereclause = [[$wheremonth, '>=', $days7]];
                break;
            default:
                $wherestr = 'whereBetween';
                $wheremonthval = [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()];
                $wheretype = 'months';
                break;
        endswitch;
        return array(
            "whereclause" => $whereclause,
            "wheretype" => $wheretype,
            "wheremonthval" => $wheremonthval,
            "wherestr" => $wherestr
        );
    }

    public function updateDotEnv($creds = array())
    {
        if (!empty($creds)) {
            $envFile = app()->environmentFilePath();
            $str = file_get_contents($envFile);

            foreach ($creds as $key => $config) {
                $oldValue = config($config['configkey']);
                $str = str_replace($key . "=" . $oldValue, $key . "=" . $config['newval'], $str);
            }

            $fp = fopen($envFile, 'w');
            fwrite($fp, $str);
            fclose($fp);
        }
    }
    public function checkdisableopenorder($storeidonly)
    {
        $editing_status = '';
        $disabletype = 'manual';
        if ($storeidonly > 0) {
            $storeinfo  = Stores::where('id', $storeidonly)->first();
            $editing_status = ($storeinfo->editing_status != null && $storeinfo->editing_status != '') ? $storeinfo->editing_status : '';
            $editing_status = ($editing_status == 'Forced Enable') ? 'Enable' : $editing_status;

            $disable_type = $storeinfo->disable_type;
            $disable_date = $storeinfo->disable_date;
            $disable_enddate = $storeinfo->disable_enddate;
            $disable_time = $storeinfo->disable_time;
            $disable_endtime = $storeinfo->disable_endtime;

            $disable_date2 = $storeinfo->disable_date2;
            $disable_enddate2 = $storeinfo->disable_enddate2;
            $disable_time2 = $storeinfo->disable_time2;
            $disable_endtime2 = $storeinfo->disable_endtime2;

            $datetoday = date("Y-m-d");
            $timetoday = date("H:i:s");
            $starttime = DateTime::createFromFormat('H:i:s', $disable_time);
            $endtime = DateTime::createFromFormat('H:i:s', $disable_endtime);

            $starttime2 = DateTime::createFromFormat('H:i:s', $disable_time2);
            $endtime2 = DateTime::createFromFormat('H:i:s', $disable_endtime2);

            $currenttime = DateTime::createFromFormat('H:i:s', $timetoday);

            $dateinbetween = ($datetoday >= $disable_date && $datetoday <= $disable_enddate) ? true : false;
            $timeinbetween = ($currenttime >= $starttime && $currenttime <= $endtime) ? true : false;

            $dateinbetween2 = ($datetoday >= $disable_date2 && $datetoday <= $disable_enddate2) ? true : false;
            $timeinbetween2 = ($currenttime >= $starttime2 && $currenttime <= $endtime2) ? true : false;

            if ($disable_type == 'daily') {
                if ($timeinbetween || $timeinbetween2) {
                    $editing_status = 'Disable';
                    $disabletype = 'auto';
                }
            } else {
                if (($dateinbetween && $timeinbetween) || ($dateinbetween2 && $timeinbetween2)) {
                    $editing_status = 'Disable';
                    $disabletype = 'auto';
                }
            }

            if ($storeinfo->editing_status == 'Forced Enable') {
                $editing_status = 'Enable';
                $fe_time = explode(' ', $storeinfo->force_enable_datetime);
                $forcetime = date('H:i:s', strtotime($fe_time[1]));

                $forcetimeinbetween = ($forcetime >= $disable_time && $forcetime <= $disable_endtime) ? 1 : 0;
                $forcetimeinbetween2 = ($forcetime >= $disable_time2 && $forcetime <= $disable_endtime2) ? 1 : 0;
                // echo $forcetimeinbetween .'=='.$forcetimeinbetween2;
                if ($forcetimeinbetween == 0 && $forcetimeinbetween2 == 0) {
                    Stores::whereId($storeidonly)->update([
                        'editing_status' => 'Enable',
                        'force_enable_datetime' => ''
                    ]);
                }
            }
        }
        // echo $editing_status.' == '.$disabletype;
        return array(
            "editstatus" => $editing_status,
            "disabletype" => $disabletype
        );
    }
    public function getuser_storeid($serverstore = false)
    {
        $userinfo = Auth::user();
        $userid = $userinfo->id;
        $country_store = session('country_store');
        if (empty($country_store)) {
            $country_store = 'US';
        }
        if ($userinfo->is_admin == 2) {
            $userid = $userinfo->client_user_id;
        }
        $customer_id = session('customer_id');
        if (!empty($customer_id)) {
            $userid = $customer_id;
        }
        $storeinfo  = Stores::where('user_id', $userid)->where('country', $country_store)->first();
        $storename = $storeinfo->store_name;
        $storeid = $storeinfo->id;
        if ($serverstore) {
            $storeid = $storeinfo->store_ids;
        }
        return $storeid;
    }
    public function getfilter_query($datefilter, $monthqry = null, $customstartdate = null, $customenddate = null)
    {
        $wheretype = 'days';
        $wheremonth = ($monthqry != '') ? $monthqry : 'OrderDate';
        $wheremonthval = $whereclause = '';
        $wherestr = 'where';
        switch ($datefilter):
            case 'thismonth':
                $wherestr = 'whereBetween';
                $firstmonthdate = date('Y-m-01');
                $lastmonthdate = date('Y-m-t');
                $wheremonthval = [$firstmonthdate, $lastmonthdate];
                $wheretype = 'months';
                break;
            case '30days':
                $wherestr = 'whereBetween';
                $startdate = Carbon::now()->subDays(30);
                $enddate = Carbon::now()->subDays(-1);
                $wheremonthval = [$startdate, $enddate];
                $wheretype = 'months';
                break;
            case 'lastmonth':
                $wherestr = 'whereBetween';
                $wheremonthval = [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()];
                $wheretype = 'months';
                break;
            case 'thisquarter':
                $dates = $this->getDatesOfQuarter('current', null, 'Y-m-d');
                $firstmonthdate = $dates['start'];
                $lastmonthdate = $dates['end'];
                $wheremonthval = [$firstmonthdate, $lastmonthdate];
                $wherestr = 'whereBetween';
                $wheretype = 'months';
                break;
            case 'lastquarter':
                $dates = $this->getDatesOfQuarter('previous', null, 'Y-m-d');
                $firstmonthdate = $dates['start'];
                $lastmonthdate = $dates['end'];
                $wheremonthval = [$firstmonthdate, $lastmonthdate];
                $wherestr = 'whereBetween';
                $wheretype = 'months';
                break;
            case 'last12months':
                $wherestr = 'whereBetween';
                $wheremonthval = [Carbon::now()->subYear(), Carbon::now()];
                $wheretype = 'months';
                break;
            case '7days':
                $wherestr = 'whereBetween';
                $startdate = Carbon::now()->subDays(7);
                $enddate = Carbon::now()->subDays(-1);
                $wheremonthval = [$startdate, $enddate];
                $wheretype = 'months';
                break;
            case 'custom':
                $wherestr = 'whereBetween';
                $wheremonthval = [$customstartdate, $customenddate];
                $wheretype = 'months';
                break;
            default:
                $wherestr = 'whereBetween';
                $wheremonthval = [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()];
                $wheretype = 'months';
                break;
        endswitch;

        return array(
            "whereclause" => $whereclause,
            "wheretype" => $wheretype,
            "wheremonthval" => $wheremonthval,
            "wherestr" => $wherestr
        );
    }
}
