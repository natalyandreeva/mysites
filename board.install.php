<?php
/*
=====================================================
 Модуль создал: REZER (http://rezer.net)
=====================================================
 Назначение: мастер установки и обновления модулей
=====================================================
*/

//-------------------------------------------------====
//	Запускаем опции
//-------------------------------------------------====

@session_start();
@ob_start();
@ob_implicit_flush( 0 );

@error_reporting ( E_ALL ^ E_WARNING ^ E_DEPRECATED ^ E_NOTICE );
@ini_set( "display_errors", true );
@ini_set( "html_errors", false );
@ini_set( "error_reporting", E_ALL ^ E_WARNING ^ E_DEPRECATED ^ E_NOTICE );

define( "DATALIFEENGINE", true );
define( "ROOT_DIR", dirname ( __FILE__ ) );
define( "ENGINE_DIR", ROOT_DIR."/engine" );

//-------------------------------------------------====
//	Грузим эти самые файлы
//-------------------------------------------------====

require_once( ENGINE_DIR."/data/config.php" );
require_once( ROOT_DIR."/language/".$config['langs']."/website.lng" );
require_once( ENGINE_DIR."/classes/mysql.php" );
require_once( ENGINE_DIR."/data/dbconfig.php" );

if( $config['version_id'] >= 8 )
	require_once( ENGINE_DIR."/inc/include/functions.inc.php" );
else
	require_once( ENGINE_DIR."/inc/functions.inc.php" );
	
require_once( ENGINE_DIR."/modules/sitelogin.php" );

//-------------------------------------------------====
//	Проверяем язык
//-------------------------------------------------====

$config['charset'] = ( $lang['charset'] != "" ) ? $lang['charset'] : $config['charset'];

//-------------------------------------------------====
//	Проверка на администраторность пользователя
//-------------------------------------------------====

if( !$is_logged ) die( error );
if( $member_id['user_group'] != 1 && $member_db[1] != 1 ) die( error );

//-------------------------------------------------====
//	Функция вывода шапки сайта
//-------------------------------------------------====

function EchoHeadInstall( $title = "Мастер установки и обновления модулей от <a href=\"http://rezer.net/\" target=\"_blank\">Rezer.net</a>" ){
	global $ModuleName;
	
	$lang['skin_title'] = strip_tags( $title );
	require_once( ENGINE_DIR."/skins/default.skin.php" );
	$skin_header = preg_replace( "/{header-text}/", "", $skin_header );
	$skin_header = preg_replace( "/{user}/", $title, $skin_header );
	$skin_header = preg_replace( "#{group}#Us", $ModuleName, $skin_header );
	$skin_header = preg_replace( "#{js_files}#Us", "", $skin_header );
	$skin_header = preg_replace( "#&nbsp;<map(.*)</map>#Us", "", $skin_header );
	
	echo $skin_header;
}

//-------------------------------------------------====
//	Вывод сообщения
//-------------------------------------------------====

function EchoBlockMaster( $about, $result = "", $title = "Мастер установки определил:" ){

	EchoHeadInstall();	
	opentable( true );
	tableheader( "Мастер установки и обновления модулей от <a href=\"http://rezer.net/\" target=\"_blank\">Rezer.net</a>" );
			
if( $result ) $itog = <<<HTML
<div class="hr_line"></div>
<div style="padding: 5px;">
	{$result}
</div>
HTML;

echo <<<HTML
<div style="padding: 5px;">
	<b>{$title}</b><br /><br />
	{$about}
</div>
{$itog}
HTML;
	
	closetable();
	footer();
}

//-------------------------------------------------====
//	Функция конвертации
//-------------------------------------------------====

function CharsetConvert( $text, $to = "auto" ){
	global $config;
			
	$text = stripslashes( $text );
	$charset = mb_detect_encoding( $text, "utf-8,windows-1251" );
	if( $to == "auto" ) $to = $config['charset'];
	if( $charset != $to && $to != "" ) $text = iconv( $charset, $to."//IGNORE", $text );
	return urldecode( $text );
}

//-------------------------------------------------====
//	Сохранение конфигов модуля
//-------------------------------------------------====
	
function SaveConfig( $Opt = array(), $LastOpt, $NameOpt, $File, $title = "(Powered by REZER)" ){
	
	if( !is_array( $LastOpt ) ) $LastOpt = array();
	$save_con = $Opt + $LastOpt;
	$handler = fopen( $File, "w" );
	fwrite( $handler, "<?php \n\n//{$title}\n\n\${$NameOpt} = array (\n" );
	foreach( $save_con as $name => $value )
		{
			if( is_array( $value ) ) $value = implode( ",", $value );
			$value = addslashes( stripslashes( trim( $value ) ) );
			fwrite( $handler, "\t\"{$name}\" => \"{$value}\",\n" );
		}
	fwrite( $handler, ");\n\n?>" );
	fclose( $handler );
}

//-------------------------------------------------====
//	Информация для редактирования файлов
//-------------------------------------------------====

function ListInfoEditFile( $Info, $version, $type = "install" ){
	
	if( count( $Info ) > 0 )
		{
			$List = "";
			foreach( $Info as $EditInfo )
				{
					$title = stripslashes( $EditInfo['title'] );
					$content = stripslashes( $EditInfo['content'] );
					if( $content ) $content = "<br /><textarea style=\"width: 100%; height: auto; background: #F1FEE2;\">{$content}</textarea><br />";

$List .= <<<HTML
<div class="hr_line"></div>
<div style="padding: 5px;" class="navigation">
	<strong>{$title}</strong><br />
	{$content}
</div>
HTML;

					}
			}
				else
			{
				$List = $type == "install" ? "Для установки модуля версии {$version} никаких изменений в файлах не требуется." : "Для обновления модуля на версию {$version} никаких изменений в файлах не требуется.";
			}
			
	return $List;	
}

function SqlQuery( $sqlData ){
	global $db;
	
	foreach( $sqlData as $query )
		{
			$query = trim( $query );
			$query = str_replace( "{prefix}", PREFIX, $query );
			$db->query( $query );
		}
}

//-------------------------------------------------====
//	Настройки установщика
//-------------------------------------------------====

$ModuleName = "DLE Board";
$LicenseLink = "http://rezer.net/module/board/license.html";
$ModulePage = "board";
$FolderData = "board.installdb";
$options['menu'] = array();
$ModAllowVersion = array( "1.1" );
$ThisFile = $_SERVER['SCRIPT_NAME'];

$ConfigFile = ENGINE_DIR."/data/board.config.php";
$RequireFiles = array( 
	ENGINE_DIR."/inc/board/functions.php",
);

$AllowUpdate = true;
$AllowNext = true;
if( file_exists( $ConfigFile ) )
	require_once( $ConfigFile );
else
	$AllowUpdate = false;
	
foreach( $RequireFiles as $file )
	{
		if( !file_exists( $file ) ) 
			$AllowNext = false;
		else
			require_once( $file );
	}
	
$ModServerVersion = $BoardConfig['id_version'];
sort( $ModAllowVersion );
$ModuleInstallVersion = end( $ModAllowVersion );
$action = $_REQUEST['action'];

//-------------------------------------------------------------------
//
//			Проверка на загруженность всех файлов модуля
//
//-------------------------------------------------------------------

if( $AllowNext !== true )
	{
		EchoBlockMaster( "Не были найдены все необходимые файлы модуля на вашем сервере.", "<span style=\"color: #F00;\">Установка не возможна (загрузите все файлы и обновите страницу)</a>" );
		die();
	}

//-------------------------------------------------------------------
//
//					Установка или обновление?
//
//-------------------------------------------------------------------

if( $action == "start" )
	{
		$LinkInstall = $ModServerVersion != "" ? "Установить (невозможно т.к. модуль уже установлен)" : "<a href=\"?action=install\">Установить</a>";
		$LinkUpdate = $ModServerVersion != "" ? "<a href=\"?action=update\">Обновить<a/>" : "Обновить (невозможно т.к. модуль не был установлен)";
		
		if( $ModServerVersion != "" )
			{
				EchoHeadInstall();	
				opentable( true );
				tableheader( "Мастер установки и обновления модулей от <a href=\"http://rezer.net/\" target=\"_blank\">Rezer.net</a>" );

echo <<<HTML
<div style="padding: 5px;">
	<b>Мастер установки сообщает:</b><br /><br />
	У вас установлена версия модуля: {$ModServerVersion}<br />
	Я забыл сделать изменения в файлах при обновлении или установке, <a href="?action=edit-file">посмотреть что нужно делать</a>.<br />
	Если вы хотите обновить модуль, то нажмите ссылку, расположенную нижу.
</div>
<div class="hr_line"></div>
<div style="padding: 5px;">
	{$LinkInstall} | {$LinkUpdate}
</div>
HTML;
	
				closetable();
				footer();
			}
				else
			{
				EchoBlockMaster( "Вы хотите установить модуль или обновить?", "{$LinkInstall} | {$LinkUpdate}", "Мастер установки интересуется:" );
			}
	}
	
//-------------------------------------------------------------------
//
//				Установка модуля
//
//-------------------------------------------------------------------

elseif( $action == "edit-file" )
	{
		
		EchoHeadInstall();	
		opentable( true );
		tableheader( "Мастер установки и обновления модулей от <a href=\"http://rezer.net/\" target=\"_blank\">Rezer.net</a>" );
		
		sort( $ModAllowVersion );
		
		$EchoVersion = $_REQUEST['version'];
		if( !in_array( $EchoVersion, $ModAllowVersion ) ) $EchoVersion = "";
		
		if( $EchoVersion )
			{
				if( file_exists( ROOT_DIR."/{$FolderData}/{$EchoVersion}.php" ) )
					{
						require( ROOT_DIR."/{$FolderData}/{$EchoVersion}.php" );
						$ListEditFilesUpdate = ListInfoEditFile( $EditFilesUpdate, $EchoVersion, "update" );
						$ListEditFilesInstall = ListInfoEditFile( $EditFilesInstall, $EchoVersion );
					}
						else
					{
						$ListEditFilesUpdate = "Файл информации для данной версии не найден.";
						$ListEditFilesInstall = "Файл информации для данной версии не найден.";
					}
			}
				else
			{
				$ListEditFilesUpdate = "Выберите необходимую вам версию.";
				$ListEditFilesInstall = "Выберите необходимую вам версию.";
			}
		
		$result = "";
		foreach( $ModAllowVersion as $version )
			{
				$result .= $version == $EchoVersion ? "[{$version}] ": "[<a href=\"?action=edit-file&version={$version}\">{$version}</a>] ";
			}

echo <<<HTML
<div style="padding: 5px;">
	<b>Мастер установки спрашивает:</b><br /><br />
	Если вы забыли выполнить изменения при установке, то можете найти их здесь.<br />
	При обновлении на какую версию модуля вы забыли выполнить изменения в файлах?<br /><br />
	[<a href="?action=start">Вернуться назад</a>] {$result}
</div>
<div class="hr_line"></div>
<div style="padding: 5px;">
	<div id="OptChange">
		<div class="dle_aTab" style="padding: 10px;">
			{$ListEditFilesUpdate}
		</div>
		<div class="dle_aTab" style="padding: 10px;">
			{$ListEditFilesInstall}
		</div>
	</div>
	<script type="text/javascript" src="engine/skins/tabs.js"></script>
	<script type="text/javascript">
	   initTabs( "OptChange", Array( "При обновлении", "При установке" ),0, '100%' );
	</script>
</div>
HTML;
	
		closetable();
		footer();
	}

//-------------------------------------------------------------------
//
//				Установка модуля
//
//-------------------------------------------------------------------

elseif( $action == "install" )
	{
		if( $ModServerVersion != "" )
			{
				EchoBlockMaster( "Ваша версия установленного модуля: {$ModServerVersion}<br /><br />&raquo; <a href=\"/{$config['admin_path']}?mod={$ModulePage}\">Перейти в админцентр модуля</a><br />&raquo; <a href=\"?action=start\">Вернуться назад</a>", "Итог: <span style=\"color: #F00;\">у вас модуль уже установлен!</span> (попробуйте <a href=\"?action=update\">Обновить<a/>)" );
			}
				else
			{
				if( file_exists( ROOT_DIR."/{$FolderData}/{$ModuleInstallVersion}.php" ) )
					{
						require( ROOT_DIR."/{$FolderData}/{$ModuleInstallVersion}.php" );
						if( $_REQUEST['sql'] == "true" )
							{
								$sqlData = CharsetConvert( $_REQUEST['sqldata'] );
								$sqlData = explode( ";", $sqlData );
								if( trim( end( $sqlData ) ) == "" ) unset( $sqlData[ ( count( $sqlData ) - 1 ) ] );
								SqlQuery( $sqlData );
												
								if( is_array( $ConfigFileInstall ) )
									{
										foreach( $ConfigFileInstall as $InstallFile )
											{
												SaveConfig( $InstallFile['config'], array(), $InstallFile['variable'], $InstallFile['file'], $InstallFile['comments'] );
											}
									}
									
								if( is_array( $CreateFileInstall ) )
									{
										foreach( $CreateFileInstall as $InstallFile )
											{
												$fp = fopen( $InstallFile['file'], "w" );
												if( $InstallFile['value'] ) fwrite( $fp, $InstallFile['value'] );
												fclose( $fp );
												chmod( $InstallFile['file'], $InstallFile['chmod'] );
											}
									}
												
								die( "Запросы успешно выполнены, файлы конфигурации созданы." );
							}
											
						EchoHeadInstall();	
						opentable( true );
						tableheader( "Мастер установки и обновления модулей от <a href=\"http://rezer.net/\" target=\"_blank\">Rezer.net</a>");
										
						$SqlInstall = implode( "\n", $SqlDataInstall );
						if( $config['version_id'] == "9.0" ) $JS = "<script language=\"javascript\" type=\"text/javascript\">function ShowLoading(){var Ajax = new dle_ajax; Ajax.onShow( \"\" );}function HideLoading(){var Ajax = new dle_ajax; Ajax.onHide( \"\" );}</script>";
						
						$ListEditFilesInstall = ListInfoEditFile( $EditFilesInstall, $ModuleInstallVersion );
											
						if( !count( $SqlDataInstall ) && !count( $EditFilesInstall ) )
							$InfoUser = "<strong>Мастер установки определил</strong>, что для установки модуля не требуется изменения в файлах движка и обновления базы данных. Вам необходимо только создать конфигурационные файлы, для этого нажмите на кнопку \"Выполнить SQL и создать файлы.\"";
						elseif( !count( $EditFilesInstall ) )
							$InfoUser = "<strong>Мастер установки определил</strong>, что для установки модуля не требуется изменения в файлах движка. Вам необходимо только создать конфигурационные файлы и выполнить запросы к БД, для этого нажмите на кнопку \"Выполнить SQL и создать файлы.\"";
											
						if( $InfoUser ) $InfoUser = "<div class=\"hr_line\"></div><div style=\"padding: 5px;\">{$InfoUser}</div>";

								
echo <<<HTML
<script type="text/javascript" src="engine/classes/js/jquery.js"></script>
<script type="text/javascript" src="engine/classes/js/jqueryui.js"></script>
<script type="text/javascript" src="engine/skins/default.js"></script>
{$JS}
<script language="javascript" type="text/javascript">
	function SendSQL(){
		
		var Quest = confirm( "Вы подтверждаете, что хотите выполнить sql запросы, которые находятся в текстовом поле?" );
		if( Quest === true )
			{
				var SqlData = document.getElementById( "sql_data" ).value;
				if( document.getElementById( "SqlResult" ).style.display == "none" ) ShowOrHide( "SqlResult" );
				$( "#SqlResult" ).html( "Выполнение, дождитесь ответа..." );

				
				$.ajax({
					url: "{$ThisFile}",
					data: "&action=install&sql=true&sqldata=" + SqlData,
					success: function( data ){
						$( "#SqlResult" ).html( data );
					},
					dataType: "html",
					type: "POST"
				});
			}
	}
</script>
<div style="padding: 5px;">
	<b>Мастер установки определил:</b><br /><br />
	Сейчас вы устанавливаете версию модуля: {$ModuleInstallVersion}
</div>
<div class="hr_line"></div>
<div style="padding: 5px;">
	<strong>Инструкция:</strong> сначала выполните запросы к БД (отредактировать если нужно) и создайте файлы конфигурации, затем выполните изменения в файлах и нажмите кнопку "Я всё сделал".
</div>
{$InfoUser}
<div class="hr_line"></div>
<div style="padding: 5px;">
	<div id="OptChange">
		<div class="dle_aTab" style="padding: 10px;">
			<a href="javascript:void(0);" onclick="ShowOrHide( 'sql_textarea' );">Показать какие запросы будут выполнены (можно изменить)</a><br />
			<div id="sql_textarea" style="display: none;">
			<br /><textarea id="sql_data" style="width: 100%; height: 100px;">{$SqlInstall}</textarea><br /><br />
			Примечание - вы можете изменить запросы по желанию<br />
			{prefix} - заменяется на ваш префикс к бд<br />
			Символ ";" - разделитель для запроса<br />
			</div><br />
			<input type="submit" value="Выполнить SQL запросы к моей БД и создать файлы конфигурации" onclick="SendSQL(); return false;" class="buttons" />
			<div id="SqlResult" style="display: none; margin: 10px 0px 0px 0px; padding: 5px; border: 1px solid #cccccc; background: #F4FEF3;"></div>
		</div>
		<div class="dle_aTab" style="padding: 10px;">
			<div style="padding: 5px;" class="navigation">
				Теперь вам необходимо выполнить следующие действия:
			</div>
			{$ListEditFilesInstall}
		</div>
	</div>
	<script type="text/javascript" src="engine/skins/tabs.js"></script>
	<script type="text/javascript">
	   initTabs( "OptChange", Array( "База данных", "Изменения в файлах" ),0, '100%' );
	</script>
</div>
<div class="hr_line"></div>
<div style="padding: 5px;">
	<input type="button" class="buttons" onclick="if( confirm( 'Вы уверены, что всё сделали?' ) === true ) window.location = '?action=start';" value="Я всё сделал" />
	<input type="button" class="buttons" onclick="if( confirm( 'Вы уверены, что хотите прямо сейчас перейти в админцентр модуля?' ) === true ) window.location = '/{$config[admin_path]}?mod={$ModulePage}';" value="Перейти в админцентр модуля" />
</div>
HTML;
									
						closetable();
						footer();
					}
						else
					{
						EchoBlockMaster( "Файл с информацией для обновления не найден!<br /><br />&raquo; <a href=\"/{$config['admin_path']}?mod={$ModulePage}\">Перейти в админцентр модуля</a><br />&raquo; <a href=\"?action=start\">Вернуться назад</a>", "Итог: <span style=\"color: #F00;\">обновление не возможно!</span>", "Мастер установки обнаружил:" );
					}
			}
	}
	
//-------------------------------------------------------------------
//
//				Обновление модуля
//
//-------------------------------------------------------------------

elseif( $action == "update" )
	{
		if( $ModServerVersion != "" )
			{
				foreach( $ModAllowVersion as $i => $value )
					{
						if( version_compare( $ModAllowVersion[ $i ], $ModServerVersion, "<" ) || $ModAllowVersion[ $i ] == $ModServerVersion ) unset( $ModAllowVersion[ $i ] );
					}
				
				sort( $ModAllowVersion );
				if( count( $ModAllowVersion ) > 1 )
					{
						$NowModInstallVersion = $ModAllowVersion[0];
						$StadesInstall = implode( ", потом на ", $ModAllowVersion );
						$result = "<strong>Итог:</strong> вам придётся обновиться сначала на {$StadesInstall} и всё.";
					}
						else
					{
						$NowModInstallVersion = end( $ModAllowVersion );
						$result = "<strong>Итог:</strong> вам придётся обновиться только на версию {$NowModInstallVersion}";
					}
				
				$ModLastVersion = end( $ModAllowVersion );
				if( version_compare( $ModLastVersion, $ModServerVersion, ">" ) )
					{
						$RequestVersion = $_REQUEST['version'];
						if( !in_array( $RequestVersion, $ModAllowVersion ) || $RequestVersion != $NowModInstallVersion ) $RequestVersion = "";
						if( !$RequestVersion )
							{
								EchoHeadInstall();	
								opentable( true );
								tableheader( "Мастер установки и обновления модулей от <a href=\"http://rezer.net/\" target=\"_blank\">Rezer.net</a>");
echo <<<HTML
<div style="padding: 5px;">
	<b>Мастер установки определил:</b><br /><br />
	Ваша версия установленного модуля: {$ModServerVersion}<br />
	Последняя версия, на которую можно обновиться: {$ModLastVersion}
</div>
<div class="hr_line"></div>
<div style="padding: 5px;">
	<strong>Я согласен:</strong> <a href="?action=update&amp;version={$NowModInstallVersion}">Начать обновление ({$ModServerVersion} на версию {$NowModInstallVersion})</a>
</div>
<div class="hr_line"></div>
<div style="padding: 5px;">
	{$result}
</div>
HTML;
								closetable();
								footer();
							}
								else
							{
								if( file_exists( ROOT_DIR."/{$FolderData}/{$NowModInstallVersion}.php" ) )
									{
										require( ROOT_DIR."/{$FolderData}/{$NowModInstallVersion}.php" );
										if( $_REQUEST['sql'] == "true" )
											{
												$sqlData = CharsetConvert( $_REQUEST['sqldata'] );
												$sqlData = explode( ";", $sqlData );
												if( trim( end( $sqlData ) ) == "" ) unset( $sqlData[ ( count( $sqlData ) - 1 ) ] );
												SqlQuery( $sqlData );
												
												if( is_array( $ConfigFileUpdate ) )
													{
														foreach( $ConfigFileUpdate as $UpdateFile )
															{
																SaveConfig( $UpdateFile['config'], $$UpdateFile['variable'], $UpdateFile['variable'], $UpdateFile['file'], $UpdateFile['comments'] );
															}
													}
												
												if( is_array( $CreateFileUpdate ) )
													{
														foreach( $CreateFileUpdate as $UpdateFile )
															{
																$fp = fopen( $UpdateFile['file'], "w" );
																if( $UpdateFile['value'] ) fwrite( $fp, $UpdateFile['value'] );
																fclose( $fp );
																chmod( $UpdateFile['file'], $UpdateFile['chmod'] );
															}
													}
												
												die( "Запросы успешно выполнены, файлы конфигурации обновлены." );
											}
											
										EchoHeadInstall();	
										opentable( true );
										tableheader( "Мастер установки и обновления модулей от <a href=\"http://rezer.net/\" target=\"_blank\">Rezer.net</a>");
										
										$SqlInstall = implode( "\n", $SqlDataUpdate );
										if( $config['version_id'] == "9.0" ) $JS = "<script language=\"javascript\" type=\"text/javascript\">function ShowLoading(){var Ajax = new dle_ajax; Ajax.onShow( \"\" );}function HideLoading(){var Ajax = new dle_ajax; Ajax.onHide( \"\" );}</script>";
										
										$ListEditFilesUpdate = ListInfoEditFile( $EditFilesUpdate, $NowModInstallVersion, "update" );
										if( !count( $SqlDataUpdate ) && !count( $EditFilesUpdate ) )
											$InfoUser = "<strong>Мастер установки определил</strong>, что для обновления модуля на версию {$NowModInstallVersion} не требуется изменения в файлах движка и обновления базы данных. Вам необходимо обновить только конфигурационные файлы, для этого нажмите на кнопку \"Выполнить SQL и обновить файлы.\"";
										elseif( !count( $EditFilesUpdate ) )
											$InfoUser = "<strong>Мастер установки определил</strong>, что для обновления модуля на версию {$NowModInstallVersion} не требуется изменения в файлах движка. Вам необходимо обновить только конфигурационные файлы и выполнить запросы к БД, для этого нажмите на кнопку \"Выполнить SQL и обновить файлы.\"";
											
										if( $InfoUser ) $InfoUser = "<div class=\"hr_line\"></div><div style=\"padding: 5px;\">{$InfoUser}</div>";

								
echo <<<HTML
<script type="text/javascript" src="engine/classes/js/jquery.js"></script>
<script type="text/javascript" src="engine/classes/js/jqueryui.js"></script>
<script type="text/javascript" src="engine/skins/default.js"></script>
{$JS}
<script language="javascript" type="text/javascript">
	function SendSQL(){
		
		var Quest = confirm( "Вы подтверждаете, что хотите выполнить sql запросы, которые находятся в текстовом поле?" );
		if( Quest === true )
			{
				var SqlData = document.getElementById( "sql_data" ).value;
				if( document.getElementById( "SqlResult" ).style.display == "none" ) ShowOrHide( "SqlResult" );
				$( "#SqlResult" ).html( "Выполнение, дождитесь ответа..." );
				
				$.ajax({
					url: "{$ThisFile}",
					data: "&action=update&version={$NowModInstallVersion}&sql=true&sqldata=" + SqlData,
					success: function( data ){
						$( "#SqlResult" ).html( data );
					},
					dataType: "html",
					type: "POST"
				});
			}
	}
</script>
<div style="padding: 5px;">
	<b>Мастер установки определил:</b><br /><br />
	Ваша версия установленного модуля: {$ModServerVersion}<br />
	Сейчас вы обновляетесь на версию: {$NowModInstallVersion}
</div>
<div class="hr_line"></div>
<div style="padding: 5px;">
	<strong>Инструкция:</strong> сначала выполните запросы к БД (отредактировать если нужно) и обновите файлы конфигурации, затем выполните изменения в файлах и нажмите кнопку "Я всё сделал".
</div>
{$InfoUser}
<div class="hr_line"></div>
<div style="padding: 5px;">
	<div id="OptChange">
		<div class="dle_aTab" style="padding: 10px;">
			<a href="javascript:void(0);" onclick="ShowOrHide( 'sql_textarea' );">Показать какие запросы будут выполнены (можно изменить)</a><br />
			<div id="sql_textarea" style="display: none;">
			<br /><textarea id="sql_data" style="width: 100%; height: 100px;">{$SqlInstall}</textarea><br /><br />
			Примечание - вы можете изменить запросы по желанию<br />
			{prefix} - заменяется на ваш префикс к бд<br />
			Символ ";" - разделитель для запроса<br />
			</div><br />
			<input type="submit" value="Выполнить SQL запросы к моей БД и обновить файлы конфигурации" onclick="SendSQL(); return false;" class="buttons" />
			<div id="SqlResult" style="display: none; margin: 10px 0px 0px 0px; padding: 5px; border: 1px solid #cccccc; background: #F4FEF3;"></div>
		</div>
		<div class="dle_aTab" style="padding: 10px;">
			<div style="padding: 5px;" class="navigation">
				Теперь вам необходимо выполнить следующие действия:
			</div>
			{$ListEditFilesUpdate}
		</div>
	</div>
	<script type="text/javascript" src="engine/skins/tabs.js"></script>
	<script type="text/javascript">
	   initTabs( "OptChange", Array( "База данных", "Изменения в файлах" ),0, '100%' );
	</script>
</div>
<div class="hr_line"></div>
<div style="padding: 5px;">
	<input type="button" class="buttons" onclick="if( confirm( 'Вы уверены, что всё сделали?' ) === true ) window.location = '?action=update';" value="Я всё сделал" />
	<input type="button" class="buttons" onclick="if( confirm( 'Вы уверены, что хотите прямо сейчас перейти в админцентр модуля?' ) === true ) window.location = '/{$config[admin_path]}?mod={$ModulePage}';" value="Перейти в админцентр модуля" />
</div>
HTML;
									
										closetable();
										footer();
									}
										else
									{
										EchoBlockMaster( "Файл с информацией для обновления не найден!<br /><br />&raquo; <a href=\"/{$config['admin_path']}?mod={$ModulePage}\">Перейти в админцентр модуля</a><br />&raquo; <a href=\"?action=start\">Вернуться назад</a>", "Итог: <span style=\"color: #F00;\">обновление не возможно!</span>", "Мастер установки обнаружил:" );
									}
							}
					}
						else
					{
						EchoBlockMaster( "Ваша версия установленного модуля: {$ModServerVersion}<br />Последняя версия, на которую можно обновиться: нет<br /><br />&raquo; <a href=\"/{$config['admin_path']}?mod={$ModulePage}\">Перейти в админцентр модуля</a><br />&raquo; <a href=\"?action=start\">Вернуться назад</a>", "Итог: <span style=\"color: #F00;\">у вас установлена последняя версия модуля, обновление не возможно!</span>" );
					}
			}
				else
			{
				EchoBlockMaster( "Ваша версия установленного модуля: <span style=\"color: #F00;\">не установлен!</span> <br />Версия, которую можно установить: {$ModuleInstallVersion}", "Итог: <span style=\"color: #F00;\">у вас модуль не установлен, обновление не возможно!</span> (попробуйте <a href=\"?action=install\">установить<a/>)" );
			}
	}

//-------------------------------------------------------------------
//
//				Главная страница принятия правил
//
//-------------------------------------------------------------------

		else
	{

		EchoHeadInstall();	
		opentable( true );
		tableheader( "Мастер установки и обновления модулей от <a href=\"http://rezer.net/\" target=\"_blank\">Rezer.net</a>" );
		
echo <<<HTML
<div style="padding: 5px;">
	<b>Мастер установки модуля</b><br /><br />
	Данный мастер поможет вам установить или обновить модуль на вашем сайте.
</div>
<div class="hr_line"></div>
<div style="padding: 5px; text-align: left; color: #000000;">
	Для продолжения, необходимо принять лиц. соглашение, которое можете прочитать по следующей ссылке:<br /><br />
	
	<a href="{$LicenseLink}" target="_blank" style="color:#03F;">{$LicenseLink}</a>
</div>
<div class="hr_line"></div>
<div style="padding: 5px;">
	<input type="checkbox" id="rules"> <label for="rules"><b>Правила принимаю</b></label>
</div>
<div class="hr_line"></div>
<div style="padding: 5px;" class="navigation">
	<input type="button" class="buttons" value="Продолжить" onclick="StartInstall();" />
</div>
<script language="Javascript">

function StartInstall(){
	
	if( document.getElementById( "rules" ).checked == false )
		{
			alert( "Вы должны принять лицензионное соглашение!" );
		}
			else
		{
			window.location = "?action=start";
		}
}

</script>
HTML;
		
		closetable();
		footer();
	}	
	
?>