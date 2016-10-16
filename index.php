<!doctype html>
<html>
	<head>
		<meta charset="utf-8">

		<title>Grips - Statistikmodul</title>
            <link rel="stylesheet" href="libs/material-design-iconic-font/css/material-design-iconic-font.min.css">
            <link rel="stylesheet" href="libs/jquery.jqplot.1.0.9/jquery.jqplot.min.css">
            <link rel="stylesheet" type="text/css" href="libs/jQCloud/dist/jqcloud.css" />
            <link rel="stylesheet" href="libs/bootstrap-3.3.7/css/bootstrap.min.css">
            <link rel="stylesheet" href="libs/jquery-ui-1.11.4.custom/jquery-ui.css">
            <link rel="stylesheet" href="libs/jQRangeSlider-master/css/iThing.css" type="text/css" />
            <link rel="stylesheet" href="libs/DataTables-1.10.12/media/css/jquery.dataTables.min.css" />
		    <link rel="stylesheet" href="res/css/style.css" id="stylesheet">
            <link rel="stylesheet" type="text/css" href="res/css/print.css" media="print">  

	</head>

	<body>
    <iframe id="ifmcontentstoprint" class="printable" style="height: 0px; width: 0px; position: absolute"></iframe>
    
    <div class="modal fade" id="chartEnlargementModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <input class="print" id="chartEnlargementModalPrint" value="Drucken" />
                    <h4 class="modal-title" id="loginStatisticsTableTitle">Chart</h4>
                </div>
                <div class="modal-body">
                    <button class="btn btn-default chartTypeButton" id="lineChartButton"><img src="res/images/line_chart.png" /></button>
                    <button class="btn btn-default chartTypeButton" id="barChartButton"><img src="res/images/bar_chart.png" /></button>
                    <div id="enlargementChart"></div>    
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="loginStatisticsModal" class="printable" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <input  class="print" id="loginStatisticsModalPrint" value="Drucken" />
                    <h4 class="modal-title" id="loginStatisticsTableTitle">Login-Statistik</h4>
                </div>
                <div class="modal-body">
                    <table class="table table-bordered" id="loginStatisticsTable">
                        <thead>
                            <tr>
                                <th>Datum</th>
                                <th>mehrfache Logins</th>
                                <th>einzelne Logins</th>
                                <th>gesamte Logins</th>
                            </tr>
                        </thead>
                        <tbody id="loginStatisticsTableItemContainer">
                            
                        </tbody>
                    </table>        
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="courseStatisticsModal" class="printable" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <input class="print" id="courseStatisticsModalPrint" value="Drucken" />
                    <h4 class="modal-title" id="courseStatisticsTableTitle">Kurs-Statistik</h4>
                </div>
                <div class="modal-body">
                    <table class="table table-bordered" id="courseStatisticsTable">
                        <thead>
                            <tr>
                                <th>Datum</th>
                                <th>Kursanzahl</th>
                                <th>Aktivitäten</th>
                            </tr>
                        </thead>
                        <tbody id="courseStatisticsTableItemContainer">
                            
                        </tbody>
                    </table>    
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="accessStatisticsModal" class="printable" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <input class="print" id="accessStatisticsModalPrint" value="Drucken" />
                    <h4 class="modal-title" id="accessStatisticsTableTitle">Zugriffs-Statistik</h4>
                </div>
                <div class="modal-body">
                    <table class="table table-bordered" id="accessStatisticsTable">
                        <thead>
                            <tr>
                                <th>Datum</th>
                                <th>Zugriffe (Dozent)</th>
                                <th>Zugriffe (Sonstige)</th>
                                <th>Beiträge (Dozent)</th>
                                <th>Beiträge (Sonstige)</th>
                            </tr>
                        </thead>
                        <tbody id="accessStatisticsTableItemContainer">
                    
                        </tbody>
                    </table>       
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="categoryStatisticsModal" class="printable" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <input class="print" id="categoryStatisticsModalPrint" value="Drucken" />
                    <h4 class="modal-title" id="courseStatisticsTableTitle">Kursbereichs-Statistik</h4>
                </div>
                <div class="modal-body">
                    <div id="coursePie"></div>
                    <table class="table table-bordered" id="categoryStatisticsTable">
                        <thead>
                            <tr>
                                <th>Kategorie</th>
                                <th>Kurse</th>
                                <th>Materialien</th>
                                <th>Teilnehmer</th>
                                <th>Dozenten</th>
                            </tr>
                        </thead>
                        <tbody id="categoryStatisticsTableItemContainer">
                            
                        </tbody>
                    </table>    
                </div>
            </div>
        </div>
    </div>

    <div id="loadingOverlay">
        <div id="calculatingResults">calculating results...</div>
    </div>

    <?php       
        require_once('../../../config.php');
        global $PAGE;
        global $OUTPUT;
        require_login(0, false);
        $context = context_system::instance();
        require_capability('moodle/site:config', $context);
        $PAGE->set_context($context);
        $PAGE->set_title("Statistikmodul");
        $PAGE->set_url('/StatisticsModule/index.php'); 
        $PAGE->set_context(context_system::instance());

        //Ausgabe der Seite
        $PAGE->navbar->add(get_string('categorystats', 'block_stats'), null);

        echo $OUTPUT->header();
      
        $OUTPUT->heading(get_string('categorystats', 'block_stats'));
    
        echo $OUTPUT->box_start('generalbox');
  

     ?>
        <div class="container printable">
            

            <ul class="nav nav-tabs nav-justified" id="StatisticsTabs">
                <li id="monthlyStatsTab" role="presentation" class="active"><a href="#monthlyStats" aria-controls="monthlyStats" role="tab" data-toggle="tab">Monatsstatistik</a></li>
                <li id="categoryStatsTab" role="presentation"><a href="#categoryStats" aria-controls="categoryStats" role="tab" data-toggle="tab">Kursbereichsstatistik</a></li>
            </ul>

            <div class="tab-content">
                <div role="tabpanel" class="tab-pane active" id="monthlyStats">


                    <div class="box" id="optionsBox">
                        <div class="title">OPTIONEN</div>

                        <div id="options">
                            <div>Zeitraum: </div>
                            <div id="slider-range"></div>
                            <input name="startDate" id="startDate" class="date-picker" readOnly />
                            <input name="endDate" id="endDate" class="date-picker" readOnly />
                        </div>
                    </div>
                    <br />
                    <div class="row" id="numbers">
                        <div class="col-md-4">
                            <div class="title box"><div>Zugriffe</div><br /><div class="number" id="readWriteCount"></div></div>
                        </div>
                        <div class="col-md-4">
                            <div class="title box"><div>Logins</div><br /><div class="number" id="loginCount"></div></div>
                        </div>
                        <div class="col-md-4">
                            <div class="title box"><div>Aktive Kurse</div><br /><div class="number" id="courseCount"></div></div>
                        </div>
                    </div>
                    <br />
                        <div class="box">
                            <div class="title"><span class="enlargementModalTitle">Zugriffs-Statistik</span><span id="readWriteChartEnlargementButton" class="zmdi zmdi-zoom-in zmdi-hc-2x chartEnlargementButton"></span><div class="more" id="accessStatisticsMoreButton">mehr</div></div>
                            <div class="innerBox"><div id="accessStatisticsChart"></div></div>
                        </div>
                        <div class="box">
                            <div class="title"><span class="enlargementModalTitle">Login-Statistik</span><span id="loginChartEnlargementButton" class="zmdi zmdi-zoom-in zmdi-hc-2x chartEnlargementButton"></span><div class="more" id="loginStatisticsMoreButton">mehr</div></div>
                            <div class="innerBox"><div id="loginStatisticsChart"></div></div>
                        </div>
                        <div class="box">
                            <div class="title"><span class="enlargementModalTitle">Kurs-Statistik</span><span id="courseChartEnlargementButton" class="zmdi zmdi-zoom-in zmdi-hc-2x chartEnlargementButton"></span><div class="more" id="courseStatisticsMoreButton">mehr</div></div>
                            <div class="innerBox"><div id="courseStatisticsChart"></div></div>
                        </div>
                </div>
                <div role="tabpanel" class="tab-pane" id="categoryStats">
                    <div class="box">
                        <div class="title">Kursbereichs-Statistik<div class="more" id="categoryStatisticsMoreButton">mehr</div></div>
                        <div class="innerBox"><div id="tagcloud" style="width: 550px; height: 350px;"></div></div>
                    </div>


                    <div class="box" id="categoryStatisticsOptionsBox">
                        <div class="title">OPTIONEN<!--<span id="categoryStatisticsOptionsAddButton" class="zmdi zmdi-plus zmdi-hc-lg"></span>--></div>

                        <div id="categoryStatisticsSelectItemContainer">
                        </div>
                        <a id="a" href="#"></a>
                    </div>

                    <div class="row" id="categoryNumbers">
                        <div class="col-md-4">
                            <div class="title box"><div>Materialien</div><br /><div class="number" id="categoryMaterialsCount"></div></div>
                        </div>
                        <div class="col-md-4">
                            <div class="title box"><div>Teilnehmer</div><br /><div class="number" id="categorySubscriberCount"></div></div>
                        </div>
                        <div class="col-md-4">
                            <div class="title box"><div>Dozenten</div><br /><div class="number" id="categoryTrainerCount"></div></div>
                        </div>
                    </div>
                    <br class="clear" />

                    <div id="categoriesSubscriberChart"></div>
                    <br class="clear" />
                    <div id="categoriesTrainerChart"></div>
                    <br class="clear" />
                    <div id="categoriesMaterialsChart"></div>

                    <table class="table table-bordered" id="categoryStatisticsCompareTable">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Teilnehmer</th>
                                <th>Dozenten</th>
                                <th>Materialien</th>
                        </thead>
                        <tbody id="categoryStatisticsCompareTableItemContainer">
                            
                        </tbody>
                    </table>

                    <div class="box" id="inactiveCoursesAndUsersBox">
                        <div class="title">Inaktive Kurse und Nutzer</div>
                        <select id="inactivityKindSelect">
                            <option>Kurse</option>
                            <option>Nutzer</option>
                        </select>
                        <select id="inactiveUsersPeriodSelect">
                            <option>1</option>
                            <option>2</option>
                            <option>5</option>
                        </select>
                        <select id="inactiveUsersPeriodYearMonthSelect">
                            <option>Jahr/e</option>
                            <option>Monat/e</option>
                        </select>
                        <button type="button" class="btn btn-primary" id="searchInactiveUsersButton">Suchen</button>
                        <br class="clear" />
                        <div id="inactiveCoursesAndUsersTableContainer"></div>
                    </div>
                    <div class="col-md-12 text-center">
                        <ul class="pagination pagination-lg pager" id="myPager"></ul>
                    </div>
                </div>
            </div>

        </div>

        <?php         
        require_once('../../../config.php');
        global $PAGE;
        global $OUTPUT;


        echo $OUTPUT->box_end();
        

        ?>


        <script type="text/html" id="categoryStatisticsSelectItem-tpl">
            <div id="<%= id %>">
                
            </div>
            <hr class="selectSeparator" />
        </script>

        <script type="text/html" id="loginStatisticsTableItem-tpl">
            <tr id="<%= id %>">
                <td><%= date %></td>
                <td><%= logins %></td>
                <td><%= singleLogins %></td>
                <td><%= allLogins %></td>
            </tr>
        </script>

        <script type="text/html" id="courseStatisticsTableItem-tpl">
            <tr id="<%= id %>">
                <td><%= date %></td>
                <td><%= courseCount %></td>
                <td><%= activities %></td>
            </tr>
        </script>

        <script type="text/html" id="accessStatisticsTableItem-tpl">
            <tr id="<%= id %>">
                <td><%= date %></td>
                <td><%= loginLecturers %></td>
                <td><%= loginOthers %></td>
                <td><%= contributionLecturers %></td>
                <td><%= contributionOthers %></td>
            </tr>
        </script>

        <script type="text/html" id="categoryStatisticsTableItem-tpl">
            <tr id="<%= id %>">
                <td><%= category %></td>
                <td><%= courseCount %></td>
                <td><%= materialsCount %></td>
                <td><%= subscriberCount %></td>
                <td><%= trainerCount %></td>
            </tr>
        </script>

        <script type="text/html" id="categoryStatisticsCompareTableItem-tpl">
            <tr id="<%= id %>">
                <td><%= title %></td>
                <td><%= subscriberCount %></td>
                <td><%= trainerCount %></td>
                <td><%= materialsCount %></td>
            </tr>
        </script>

        <script type="text/html" id="inactiveUsersTable-tpl">
            <table class="table table-bordered" id="<%= id %>">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>Email</th>
                        <th>Letztes Login</th>
                    </tr>
                </thead>
                <br class="clear" />
                <tbody id="inactiveUsersTableItemContainer">

                </tbody>
            </table>
        </script>

        <script type="text/html" id="inactiveCoursesTable-tpl">
            <table class="table table-bordered" id="<%= id %>">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Titel</th>
                        <th>Letzte Aktivität</th>
                    </tr>
                </thead>
                <br class="clear" />
                <tbody id="inactiveCoursesTableItemContainer">

                </tbody>
            </table>
        </script>

        <script type="text/html" id="inactiveUsersTableItem-tpl">
            <tr id="<%= id %>">
                <td><%= userId %></td>
                <td><%= firstname %></td>
                <td><%= lastname %></td>
                <td><%= email %></td>
                <td><%= lastlogin %></td>
            </tr>
        </script>

        <script type="text/html" id="inactiveCoursesTableItem-tpl">
            <tr id="<%= id %>">
                <td><%= courseId %></td>
                <td><%= name %></td>
                <td><%= lastActivity %></td>
            </tr>
        </script>

        <script type="text/javascript" src="libs/jquery-2.1.4.js"></script>
        <script type="text/javascript" src="libs/underscore.js"></script>
        <script type="text/javascript" src="libs/jquery-ui-1.11.4.custom/jquery-ui.js"></script>
        <script type="text/javascript" src="libs/bootstrap-3.3.7/js/bootstrap.js"></script>
        <script type="text/javascript" src="libs/spin.js"></script>
        <script type="text/javascript" src="libs/DataTables-1.10.12/media/js/jquery.dataTables.min.js"></script>
        <script type="text/javascript" src="libs/DataTables-1.10.12/plugins/sorting/date-de.js"></script>
        
        <script type="text/javascript" src="libs/jQRangeSlider-master/jQRangeSliderMouseTouch.js"></script>
        <script type="text/javascript" src="libs/jQRangeSlider-master/jQRangeSliderDraggable.js"></script>
        <script type="text/javascript" src="libs/jQRangeSlider-master/jQRangeSliderHandle.js"></script>
        <script type="text/javascript" src="libs/jQRangeSlider-master/jQRangeSliderBar.js"></script>
        <script type="text/javascript" src="libs/jQRangeSlider-master/jQRangeSliderLabel.js"></script>
        <script type="text/javascript" src="libs/jQRangeSlider-master/jQRangeSlider.js"></script>

        <script type="text/javascript" src="libs/jQRangeSlider-master/jQDateRangeSliderHandle.js"></script>
        <script type="text/javascript" src="libs/jQRangeSlider-master/jQDateRangeSlider.js"></script>
    
        <script type="text/javascript" src="libs/jQRangeSlider-master/jQEditRangeSliderLabel.js"></script>
        <script type="text/javascript" src="libs/jQRangeSlider-master/jQEditRangeSlider.js"></script>
        <script type="text/javascript" src="libs/jQRangeSlider-master/jQDateRangeSlider.js"></script>
        <script type="text/javascript" src="libs/jquery.jqplot.1.0.9/jquery.jqplot.js"></script>
        <script type="text/javascript" src="libs/jquery.jqplot.1.0.9/plugins/jqplot.barRenderer.js"></script>
        <script type="text/javascript" src="libs/jquery.jqplot.1.0.9/plugins/jqplot.categoryAxisRenderer.js"></script>
        <script type="text/javascript" src="libs/jquery.jqplot.1.0.9/plugins/jqplot.canvasTextRenderer.js"></script>
        <script type="text/javascript" src="libs/jquery.jqplot.1.0.9/plugins/jqplot.canvasAxisLabelRenderer.js"></script>
        <script type="text/javascript" src="libs/jquery.jqplot.1.0.9/plugins/jqplot.pointLabels.js"></script>
        <script type="text/javascript" src="libs/jquery.jqplot.1.0.9/plugins/jqplot.pieRenderer.js"></script>
        <script type="text/javascript" src="libs/jQCloud/dist/jqcloud.js"></script>
        <script type="text/javascript" src="libs/amcharts_3.20.9/amcharts/amcharts.js"></script>
        <script type="text/javascript" src="libs/amcharts_3.20.9/amcharts/serial.js"></script>
        <script type="text/javascript" src="libs/amcharts_3.20.9/amcharts/themes/light.js"></script>

        <script src="src/StatisticsModule.js"></script>
        <script src="src/MainController.js"></script>
        <script src="src/MainModel.js"></script>
        <script src="src/StatisticsView.js"></script>
        <script src="src/CategoryStatisticsView.js"></script>
        <script src="src/LoginStatisticsTableItem.js"></script>
        <script src="src/CourseStatisticsTableItem.js"></script>
        <script src="src/AccessStatisticsTableItem.js"></script>
        <script src="src/CategoryStatisticsTableItem.js"></script>
        <script src="src/CategoryStatisticsSelectItem.js"></script>
        <script src="src/CategoryStatisticsCompareTableItem.js"></script>
        <script src="src/InactiveUsersTable.js"></script>
        <script src="src/InactiveCoursesTable.js"></script>
        <script src="src/InactiveUsersTableItem.js"></script>
        <script src="src/InactiveCoursesTableItem.js"></script>

        <script>
            StatisticsModule.init();    
        </script>

        <?php         
        require_once('../../../config.php');
        global $OUTPUT;

        echo $OUTPUT->footer();
        ?>

    </body>
</html>