<?php 
    require_once('../../../config.php');

    switch($_GET['command']) {
        case 'getLoginCount':
            getLoginCount(); 
            break; 
        case 'getReadWriteData': 
            getReadWriteData(); 
            break;
        case 'getCourseData': 
            getCourseData(); 
            break;
        default: 
            return; 
    }

    function getCourseData() {  
    global $DB; 
        $startwhere = "";
        $endwhere = "";
        $activecourselimit = 1;
        $activeuserlimit = 1;
        $topcategory = 0;
        /** drei temporäre Tabellen erstellen:
         * mdl_tmp_stats_activecourses(courseid): aktive Kurse mit Aktivitäten  > activecourselimit
         * mdl_tmp_stats_activeuser(userid): aktive User mit Aktivitäten  > activeuserlimit
         * mdl_tmp_stats_coursecounts(courseid, teilnahmen, kusleitungen):
         * teilnahmen = anzahl der aktiven User im Kurs,
         * kursleitungen = anzahl der aktiven Dozentn im Kurs
         */

        //temporäre Tabelle der aktiven Kurse mdl_tmp_stats_activecourses(courseid) erstellen
        $DB->execute("DROP TABLE IF EXISTS mdl_tmp_stats_activecourses");

        //Kursdaten aus dem betrachteten Zeitraum in eine temporäre Tabelle speichern
        $sql = "CREATE TABLE mdl_tmp_stats_activecourses as SELECT courseid
             FROM `mdl_stats_monthly`
             where stattype <>'enrolments' $startwhere $endwhere
             group by courseid";

        //print_r($sql);

        $DB->execute($sql);
        $DB->execute("ALTER TABLE `mdl_tmp_stats_activecourses` ADD PRIMARY KEY ( `courseid` )");

        //temporäre Tabelle der aktiven User mdl_tmp_stats_activeuser(userid) erstellen
        $DB->execute("DROP TABLE IF EXISTS mdl_tmp_stats_activeuser");

        $sql = "CREATE TABLE mdl_tmp_stats_activeuser as SELECT distinct(userid)
        FROM `mdl_stats_user_monthly`
        where stattype <>'enrolments' $startwhere $endwhere
        group by userid";
        $DB->execute($sql);
        $DB->execute("ALTER TABLE `mdl_tmp_stats_activeuser` ADD PRIMARY KEY ( `userid` )");

        //temporäre Tabelle für die Userzahlen mdl_tmp_stats_coursecounts(courseid, teilnahmen, kusleitungen) erstellen.
        $DB->execute("DROP TABLE IF EXISTS mdl_tmp_stats_coursecounts");
        $sql = "CREATE TABLE mdl_tmp_stats_coursecounts AS SELECT courseid,
                (SELECT count(DISTINCT au.userid) as count FROM mdl_role_capabilities rc
                JOIN mdl_role_assignments ra ON rc.roleid = ra.roleid
                JOIN mdl_context ctx ON ctx.id = ra.contextid
                JOIN mdl_course crs ON crs.id = ctx.instanceid
                JOIN mdl_tmp_stats_activeuser au ON au.userid = ra.userid
                WHERE (rc.capability LIKE ('view'))
                AND crs.id  = courseid) as teilnahmen,
                (SELECT count(DISTINCT au.userid) as count FROM mdl_role_capabilities rc
                JOIN  mdl_role_assignments ra ON rc.roleid = ra.roleid
                JOIN mdl_context ctx ON ctx.id = ra.contextid
                JOIN mdl_course crs ON crs.id = ctx.instanceid
                JOIN mdl_tmp_stats_activeuser au ON au.userid = ra.userid
                WHERE (rc.capability LIKE ('update') or rc.capability LIKE ('doanything'))
                AND crs.id  = courseid
                ) as kursleitungen 
                FROM `mdl_tmp_stats_activecourses`";
        
        $DB->execute($sql);
        $DB->execute("ALTER TABLE mdl_tmp_stats_coursecounts ADD INDEX ( `courseid` )");

        //die aktiven Kurse auf die Kategorien verteilen
        $sql = "SELECT courseid, category ".
                "FROM `mdl_tmp_stats_activecourses` ".
                "JOIN mdl_course c ON c.id = courseid;";
        $courses = $DB->get_records_sql($sql);
        //echo json_encode($courses);

        $result = array();
        $courseids = array();

        $list = array();
        $parents = array();

        //GRIPS26-261 moodle 3.1 - block stats - Kategoriestatistik geht nicht
        make_categories_list_ls($list, $parents);

        foreach ($courses as $data) {

            $maincategory = false;
            
            if ($topcategory != 0) {
                if (isset($parents[$data->category][0]) &&
                    $parents[$data->category][0] ==
                        $topcategory) {
                    // we look for the category under the root category. this
                    // is either course category itself or a different parent
                    // (if there's a parent category between course category
                    // and root category).
                    $categoryparents = array_merge(
                        $parents[$data->category], array($data->category));
                    $maincategory = $categoryparents[1];
                }
            } else if (isset($parents[$data->category][0])) {
                //oberste Kategorie
                $maincategory = $parents[$data->category][0];
            }

            if ($maincategory) {
                if (!isset($courseids[$maincategory])) {
                    $courseids [$maincategory] = array();
                }
                $courseids[$maincategory][] = $data->courseid;
            }
        }

        $colors = array(
            'c_13' => "rgb(114,75,81)",// Zentrum für Sprache und Kommunikation (ZSK)
            'c_83' => "rgb(3,35,82)",   // Rechenzentrum
            'c_101' => "rgb(174,167,0)", // Wirtschaftswissenschaften
            'c_121' => "rgb(255, 255, 255)", //Verschiedenes
            'c_178' => "rgb(205,211,15)", // Rechtswissenschaft
            'c_202' => "rgb(191,0,42)",  //Psychologie, Pädagogik und Sport
            'c_208' => "rgb(156,0,75)", //Sprach-, Literatur- und Kulturwissenschaften
            'c_215' => "rgb(236,188,0)", // Katholische Theologie
            'c_227' => "rgb(0,155,119)", // Mathematik
            'c_228' => "rgb(0,137,147)", // Physik
            'c_229' => "rgb(79,184,0)", // Biologie und Vorklinische Medizin
            'c_230' => "rgb(0,135,178)",  //Chemie und Pharmazie
            'c_231' => "rgb(0,85,106)", //Medizin
            'c_315' => "rgb(236,98,0)", // Philosophie, Kunst-, Geschichts- und Gesellschaftswissenschaften
            'c_638' => "rgb(61,65,0)", // Akademisches Auslandsamt [id] => 638 )
            'c_845' => "rgb(0,0,0)", //Forschungsinitiativen
            'c_849' => "rgb(95,0,47)", //Koordinationsstelle Chancengleichheit & Familie
            'c_892' => "rgb(33,33,33)", // Hochschule Regensburg
            'c_932' => "rgb(66,66,66)", // Studierendenvertretung
            'c_1474' => "rgb(59,0,65)", //Zentrum für Hochschul- und Wissenschaftsdidaktik (ZHW)
            'c_2209' => "rgb(29,63,75)" //FUTUR - Forschungs- Und Technologietransfer Universität Regensburg
        );
        
        $sql = "SELECT id, name FROM mdl_course_categories WHERE parent = $topcategory";
        $categories = $DB->get_records_sql($sql);

        $statsdata = array();
        $courseidsstr = array();
        foreach ($courseids as $maincategory => $courseid) {
            $courseidstr[$maincategory] = "(".implode(",", $courseid).")";
            $sql = "SELECT '$maincategory' as category, '".count($courseid)."' as courses, ".
                    "sum(teilnahmen) as teilnahmen, sum(kursleitungen) as kursleitungen ".
                    "FROM mdl_tmp_stats_coursecounts ".
                    "WHERE courseid in {$courseidstr[$maincategory]} ";
            if(array_key_exists("c_".$maincategory, $colors)) {
                $statsdata[$maincategory]["courses"] = $DB->get_records_sql($sql)["".$maincategory]->courses;
                $statsdata[$maincategory]["color"] = $colors["c_".$maincategory];
                $statsdata[$maincategory]["name"] = $categories["".$maincategory]->name;
                $statsdata[$maincategory]["trainer"] = getTrainerCount($courseidstr[$maincategory]);
                $statsdata[$maincategory]["subscriber"] = getSubscriberCount($courseidstr[$maincategory]);
                $statsdata[$maincategory]["materials"] = getMaterialsCount($courseidstr[$maincategory]);
            }
        }

        echo json_encode($statsdata);
    
    }

    function make_categories_list_ls(&$list, &$parents, $requiredcapability = '',
                                  $excludeid = 0, $category = NULL, $path = "") {
        global $CFG, $DB;
        require_once($CFG->libdir.'/coursecatlib.php');

        // For categories list use just this one function:
        if (empty($list)) {
            $list = array();
        }
        $list += coursecat::make_categories_list($requiredcapability, $excludeid);

        // Building the list of all parents of all categories in the system is highly undesirable and hardly ever needed.
        // Usually user needs only parents for one particular category, in which case should be used:
        // coursecat::get($categoryid)->get_parents()
        if (empty($parents)) {
            $parents = array();
        }
        $all = $DB->get_records_sql('SELECT id, parent FROM {course_categories} ORDER BY sortorder');
        foreach ($all as $record) {
            if ($record->parent) {
                $parents[$record->id] = array_merge($parents[$record->parent], array($record->parent));
            } else {
                $parents[$record->id] = array();
            }
        }
    }

    function getSubscriberCount($courseids) {
        global $DB;
        $sql = "SELECT count(DISTINCT userid) as count ".
                "FROM mdl_role_assignments ra ".
                "JOIN mdl_context ctx ON ctx.id = ra.contextid ".
                "JOIN mdl_tmp_stats_activecourses ac ON ctx.instanceid = ac.courseid ".
                "WHERE (ra.roleid not in (1, 2, 3, 4, 8, 10 ,11,12,14,16)) ".
                "AND ctx.instanceid in $courseids";
        $count = $DB->get_record_sql($sql);

        return $count->count;
    }

    function getTrainerCount($courseids) {
        global $DB;
        $sql = "SELECT count(DISTINCT userid) as count ".
                "FROM mdl_role_assignments ra ".
                "JOIN mdl_context ctx ON ctx.id = ra.contextid ".
                "JOIN mdl_tmp_stats_activecourses ac ON ctx.instanceid = ac.courseid ".
                "WHERE (ra.roleid in (1, 2, 3, 4, 8, 10 ,11,12,14,16)) ".
                "AND ctx.instanceid in $courseids";
        $count = $DB->get_record_sql($sql);
        return $count->count;
    }

    function getMaterialsCount($courseids) {
        global $DB;
        $count = $DB->count_records_select('resource', "course in {$courseids}");
        return $count;
    }

    function getLoginCount() {
        global $DB;
        //$startwhere = " and ".strtotime("20.05.2015")."< timeend ";
        $startwhere = "";  // , DATE_FORMAT(FROM_UNIXTIME(timeend), '%d.%m.%Y') AS 'date_formatted'
        $endwhere  = "";
        $sql = "SELECT timeend, sum(stat1) as logins, sum(stat2) as singlelogins, (sum(stat1) + sum(stat2)) as gesamt, DATE_FORMAT(FROM_UNIXTIME(timeend), '%m.%Y') AS 'date_formatted'
                  FROM `mdl_stats_monthly` 
                  where stattype = 'logins' $startwhere $endwhere 
                  group by timeend order by timeend asc";

        echo json_encode($DB->get_records_sql($sql));
    }

    function getReadWriteData() {
        global $DB;
        $statsData = array();
        $startwhere = ""; 
        $endwhere = ""; 
        $wherecourseids = ""; 
        $sqldozent = "SELECT timeend, sum(stat1) as zugriff, sum(stat2) as beitrag, DATE_FORMAT(FROM_UNIXTIME(timeend), '%m.%Y') AS 'date_formatted' ".
                "FROM `mdl_stats_monthly` ".
                "WHERE stattype = 'activity' AND roleid in (1, 2, 3, 4, 8, 10 ,11,12,14, 16) $startwhere $endwhere $wherecourseids".
                "GROUP BY timeend order by timeend";
        $statsData['dozent'] = $DB->get_records_sql($sqldozent);

        $sqlstudent = "SELECT timeend, sum(stat1) as zugriff, sum(stat2) as beitrag, DATE_FORMAT(FROM_UNIXTIME(timeend), '%m.%Y') AS 'date_formatted' ".
                "FROM `mdl_stats_monthly` ".
                "WHERE stattype = 'activity' AND roleid not in (1, 2, 3, 4, 8, 10 ,11,12,14, 16) $startwhere $endwhere $wherecourseids ".
                "GROUP BY timeend order by timeend";
        $statsData['student'] = $DB->get_records_sql($sqlstudent);
        echo json_encode($statsData);
    }

?>